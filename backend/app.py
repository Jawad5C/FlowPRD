"""
FlowPRD Backend - AI-Powered PRD Transformer
Transforms any PRD format into visual diagrams with custom shapes
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from pathlib import Path

# Import our modules
from file_parser import parse_file
from ai_transformer import transform_to_diagram

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = Path('uploads')
UPLOAD_FOLDER.mkdir(exist_ok=True)
MAX_FILE_SIZE = int(os.getenv('MAX_FILE_SIZE_MB', 5)) * 1024 * 1024  # Default 5MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx', 'md'}


def allowed_file(filename: str) -> bool:
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'service': 'FlowPRD Backend',
        'version': '1.0.0'
    })


@app.route('/api/transform', methods=['POST'])
def transform_prd():
    """Transform uploaded PRD into structured visual diagram."""
    try:
        # Check for file or text input
        prd_text = None
        
        # Option 1: File upload
        if 'file' in request.files:
            file = request.files['file']
            
            if file.filename == '':
                return jsonify({'success': False, 'error': 'No file selected'}), 400
            
            if not allowed_file(file.filename):
                return jsonify({
                    'success': False, 
                    'error': f'Invalid file type. Allowed: {", ".join(ALLOWED_EXTENSIONS)}'
                }), 400
            
            # Save file temporarily
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            print(f"📄 File uploaded: {filename}")
            
            # Parse file to extract text
            prd_text = parse_file(filepath)
            
            # Clean up uploaded file
            os.remove(filepath)
            
            if not prd_text:
                return jsonify({'success': False, 'error': 'Failed to extract text from file'}), 500
        
        # Option 2: Direct text input
        elif request.json and 'text' in request.json:
            prd_text = request.json['text']
            print(f"📝 Text input received ({len(prd_text)} chars)")
        
        else:
            return jsonify({'success': False, 'error': 'No file or text provided'}), 400
        
        # Transform PRD using Gemini AI
        print("🤖 Transforming PRD with Gemini AI...")
        result = transform_to_diagram(prd_text)
        
        if not result:
            return jsonify({'success': False, 'error': 'AI transformation failed'}), 500
        
        print("✅ Transformation complete!")
        
        return jsonify({
            'success': True,
            'nodes': result['nodes'],
            'connections': result['connections'],
            'gaps_detected': result.get('gaps', []),
            'input_length': len(prd_text)
        })
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 FlowPRD Backend Starting...")
    print("="*60)
    print(f"\n🌐 API running on: http://localhost:5001")
    print(f"📁 Upload folder: {UPLOAD_FOLDER.absolute()}")
    print(f"📊 Max file size: {MAX_FILE_SIZE // (1024*1024)}MB")
    print(f"✅ Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}")
    print("\n💡 Endpoints:")
    print("   GET  /api/health")
    print("   POST /api/transform")
    print("\n🛑 Press CTRL+C to stop")
    print("="*60 + "\n")
    
    app.run(debug=True, host='127.0.0.1', port=5001)
