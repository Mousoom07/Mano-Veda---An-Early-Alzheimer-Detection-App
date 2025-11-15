import argparse
import json
import os
import sys
import tempfile

# Minimal dependencies version using librosa if available, else fallback
try:
    import librosa
    import numpy as np
except Exception as e:
    librosa = None
    np = None

try:
    import joblib
except Exception:
    joblib = None


def to_wav_if_needed(input_path: str) -> str:
    """Return a wav path. If input is not wav and ffmpeg is available, convert."""
    if input_path.lower().endswith('.wav'):
        return input_path
    # Fallback: try ffmpeg if present
    out_path = os.path.join(tempfile.gettempdir(), f"converted_{os.path.basename(input_path)}.wav")
    try:
        import subprocess
        subprocess.run([
            'ffmpeg', '-y', '-i', input_path, '-ar', '16000', '-ac', '1', out_path
        ], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return out_path
    except Exception:
        return input_path  # best-effort: just return original


def extract_features(wav_path: str):
    """Extract MFCCs, pitch proxy, and energy from wav. Return dict and flat feature vector."""
    if not librosa or not np:
        return {
            'mfcc_mean': [0.0]*13,
            'pitch': 0.0,
            'energy': 0.0,
        }, [0.0]*15

    y, sr = librosa.load(wav_path, sr=16000, mono=True)
    # Energy
    rms = librosa.feature.rms(y=y)
    energy = float(np.mean(rms))
    # Pitch proxy using spectral centroid
    centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
    pitch = float(np.mean(centroid))
    # MFCCs
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfcc_mean = np.mean(mfcc, axis=1)

    features_summary = {
        'mfcc_mean': [float(x) for x in mfcc_mean],
        'pitch': pitch,
        'energy': energy,
    }

    # Flat vector (13 + 1 + 1)
    flat = list(mfcc_mean) + [pitch, energy]
    return features_summary, [float(x) for x in flat]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', required=False)
    parser.add_argument('--labels', required=False)
    parser.add_argument('--original', required=False)
    parser.add_argument('--wav', required=False)
    args = parser.parse_args()

    wav_input = args.wav or args.original
    if not wav_input:
        print(json.dumps({'error': 'no input'}))
        sys.exit(1)

    wav_path = to_wav_if_needed(wav_input)
    features_summary, vector = extract_features(wav_path)

    label = 'unknown'
    confidence = 0.0

    # Load model/encoder if possible
    if joblib and args.model and args.labels and os.path.exists(args.model) and os.path.exists(args.labels):
        try:
            model = joblib.load(args.model)
            le = joblib.load(args.labels)
            # Model expects 2D array
            import numpy as np  # ensure available here
            X = np.array(vector, dtype=float).reshape(1, -1)
            pred = model.predict(X)[0]
            label = str(le.inverse_transform([pred])[0]) if hasattr(le, 'inverse_transform') else str(pred)
            # Confidence proxy: 1 - mean distance to neighbors if available, else 0.85 demo
            if hasattr(model, 'kneighbors'):
                dists, _ = model.kneighbors(X, n_neighbors=getattr(model, 'n_neighbors', 5))
                confidence = float(max(0.0, 1.0 - float(np.mean(dists))/10.0))
            else:
                confidence = 0.85
        except Exception:
            # leave defaults
            pass
    else:
        # Demo fallback
        label = 'neutral'
        confidence = 0.75

    # Map to clarity/fluency/pace proxies based on features
    clarity = float(min(100, max(0, (features_summary.get('energy', 0.0) * 5000))))
    fluency = float(min(100, max(0, confidence * 100)))
    pace = float(min(100, max(0, (features_summary.get('pitch', 0.0) / 50.0))))

    out = {
        'label': label,
        'confidence': confidence,
        'featuresSummary': features_summary,
        'clarity': clarity,
        'fluency': fluency,
        'pace': pace,
    }
    print(json.dumps(out))

if __name__ == '__main__':
    main()