# Backend Integration Guide

This frontend is designed to integrate with a Python backend that handles the actual image processing and ML inference. Here's how to set up the complete system:

## Backend Requirements

### Python Dependencies
```bash
pip install flask flask-cors pyvips torch torchvision numpy pillow celery redis
```

### API Endpoints Required

#### 1. File Upload
```python
@app.route('/api/upload', methods=['POST'])
def upload_file():
    # Handle large TIFF file upload
    # Return: {"success": True, "file_id": "uuid", "message": "File uploaded"}
```

#### 2. Start Processing
```python
@app.route('/api/process/<file_id>', methods=['POST'])  
def start_processing(file_id):
    # Start async processing with PyVips tiling and TransUNet inference
    # Return: {"success": True, "job_id": "uuid"}
```

#### 3. Processing Status
```python
@app.route('/api/status/<job_id>', methods=['GET'])
def get_status(job_id):
    # Return current processing status and logs
    # Return: {"status": "processing", "progress": 45, "logs": [...]}
```

#### 4. DZI Endpoints
```python
@app.route('/api/dzi/original/<file_id>.dzi')
def serve_original_dzi(file_id):
    # Serve DZI metadata for original image

@app.route('/api/dzi/original/<file_id>_files/<int:level>/<int:x>_<int:y>.<format>')
def serve_original_tiles(file_id, level, x, y, format):
    # Serve original image tiles

@app.route('/api/dzi/prediction/<job_id>.dzi') 
def serve_prediction_dzi(job_id):
    # Serve DZI metadata for prediction mask

@app.route('/api/dzi/prediction/<job_id>_files/<int:level>/<int:x>_<int:y>.<format>')
def serve_prediction_tiles(job_id, level, x, y, format):
    # Serve prediction mask tiles
```

## Processing Workflow

### 1. PyVips Tiling
```python
def create_dzi_tiles(input_path, output_dir):
    image = pyvips.Image.new_from_file(input_path)
    image.dzsave(output_dir, suffix='.jpg', tile_size=256, overlap=1)
    return f"{output_dir}.dzi"
```

### 2. TransUNet Inference
```python
def process_tiles_with_transunet(tiles_dir, model_path):
    model = load_transunet_model(model_path)
    
    for tile_file in get_tile_files(tiles_dir):
        image = load_tile(tile_file)
        prediction = model.predict(image)
        save_prediction_tile(prediction, tile_file.replace('original', 'prediction'))
```

### 3. Result Stitching
```python
def stitch_predictions(prediction_tiles_dir, output_path):
    # Stitch individual prediction tiles back into full resolution mask
    # Create DZI tiles from stitched result
    stitched = stitch_tiles(prediction_tiles_dir)
    stitched.dzsave(output_path, suffix='.png', tile_size=256, overlap=1)
```

## Frontend Configuration

Update the frontend to connect to your backend:

```typescript
// src/config/api.ts
export const API_BASE_URL = 'http://localhost:5000/api';
export const DZI_BASE_URL = 'http://localhost:5000/api/dzi';
```

## Environment Setup

### Backend (.env)
```
FLASK_ENV=development
UPLOAD_FOLDER=/path/to/uploads
TILE_CACHE_DIR=/path/to/tiles
MODEL_PATH=/path/to/transunet_model.pth
REDIS_URL=redis://localhost:6379
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
VITE_DZI_URL=http://localhost:5000/api/dzi
```

## Deployment Considerations

1. **File Storage**: Use cloud storage (S3, GCS) for large TIFF files
2. **Tile Caching**: Implement CDN for tile delivery
3. **GPU Resources**: Ensure GPU availability for TransUNet inference
4. **Memory Management**: Use PyVips streaming for large images
5. **Load Balancing**: Use Celery workers for parallel processing

This frontend provides the complete UI framework and is ready to integrate with your Python backend implementation.