import { NextRequest, NextResponse } from 'next/server'
import { tmpdir } from 'os'
import { join } from 'path'
import { promises as fs } from 'fs'
import { spawn } from 'child_process'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const original = formData.get('original') as File | null
    const wav = formData.get('wav') as File | null

    if (!original && !wav) {
      return NextResponse.json({ error: 'Missing files' }, { status: 400 })
    }

    const tmp = tmpdir()
    const baseDir = join(tmp, `voice-${Date.now()}`)
    await fs.mkdir(baseDir, { recursive: true })

    let originalPath: string | null = null
    let wavPath: string | null = null

    if (original) {
      const ab = await original.arrayBuffer()
      const buf = Buffer.from(ab)
      originalPath = join(baseDir, original.name || 'original_audio')
      await fs.writeFile(originalPath, buf)
    }

    if (wav) {
      const ab = await wav.arrayBuffer()
      const buf = Buffer.from(ab)
      wavPath = join(baseDir, 'input.wav')
      await fs.writeFile(wavPath, buf)
    }

    const pyPath = join(process.cwd(), 'voice_analysis.py')
    const modelPath = join(process.cwd(), 'knn_model.pkl')
    const labelPath = join(process.cwd(), 'label_encoder.pkl')

    const args = [pyPath, '--model', modelPath, '--labels', labelPath]
    if (originalPath) args.push('--original', originalPath)
    if (wavPath) args.push('--wav', wavPath)

    const result = await new Promise<{ code: number; stdout: string; stderr: string }>((resolve) => {
      const py = spawn('python', args, { stdio: ['ignore', 'pipe', 'pipe'] })
      let stdout = ''
      let stderr = ''
      py.stdout.on('data', (d) => (stdout += d.toString()))
      py.stderr.on('data', (d) => (stderr += d.toString()))
      py.on('close', (code) => resolve({ code: code ?? 1, stdout, stderr }))
    })

    if (result.code !== 0) {
      console.error('voice_analysis.py error:', result.stderr)
      return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
    }

    // Expecting the python script to print JSON on stdout
    const data = JSON.parse(result.stdout || '{}')

    // Basic schema fallback
    const payload = {
      label: data.label ?? 'unknown',
      confidence: data.confidence ?? 0,
      featuresSummary: data.featuresSummary ?? {},
      clarity: data.clarity ?? 0,
      fluency: data.fluency ?? 0,
      pace: data.pace ?? 0,
    }

    return NextResponse.json(payload)
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}