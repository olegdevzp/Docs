import { Component } from '@angular/core';
import { MultiPhotoPicker, MultiPhotoPickerOptions, MultiPhotoPickerResult } from './capacitor-multi-photo-picker-plugin';

@Component({
  selector: 'app-photo-picker',
  templateUrl: './photo-picker.component.html',
  styleUrls: ['./photo-picker.component.scss']
})
export class PhotoPickerComponent {
  
  selectedPhotos: any[] = [];
  
  constructor() {}
  
  async pickPhotos() {
    try {
      // Check if plugin is available
      const availability = await MultiPhotoPicker.isAvailable();
      if (!availability.available) {
        console.error('MultiPhotoPicker is not available on this platform');
        return;
      }
      
      // Configure picker options
      const options: MultiPhotoPickerOptions = {
        maxPhotos: 5,           // Maximum 5 photos
        quality: 80,            // 80% quality
        maxWidth: 1920,         // Max width 1920px
        maxHeight: 1920,        // Max height 1920px
        allowCamera: true,      // Allow camera capture
        title: 'Select Photos',
        message: 'Choose up to 5 photos from your gallery'
      };
      
      // Pick photos
      const result: MultiPhotoPickerResult = await MultiPhotoPicker.pickMultiplePhotos(options);
      
      console.log(`Selected ${result.count} photos`);
      this.selectedPhotos = result.photos;
      
      // Process each photo
      result.photos.forEach((photo, index) => {
        console.log(`Photo ${index + 1}:`);
        console.log(`- File name: ${photo.fileName}`);
        console.log(`- File size: ${photo.fileSize} bytes`);
        console.log(`- Dimensions: ${photo.width}x${photo.height}`);
        console.log(`- MIME type: ${photo.mimeType}`);
        console.log(`- Path: ${photo.path}`);
        
        // Use base64 for display
        if (photo.base64) {
          const imageUrl = `data:${photo.mimeType};base64,${photo.base64}`;
          console.log(`- Preview URL: ${imageUrl}`);
        }
      });
      
    } catch (error) {
      console.error('Error picking photos:', error);
      this.handleError(error);
    }
  }
  
  private handleError(error: any) {
    switch (error.message) {
      case 'CANCELLED':
        console.log('User cancelled photo selection');
        break;
      case 'PERMISSION_DENIED':
        console.log('Permission denied - please allow access to photos');
        break;
      case 'LIMIT_EXCEEDED':
        console.log('Too many photos selected');
        break;
      case 'UNAVAILABLE':
        console.log('Photo picker is not available');
        break;
      default:
        console.log('Unknown error occurred');
    }
  }
  
  // Example: Upload photos to server
  async uploadPhotos() {
    if (this.selectedPhotos.length === 0) {
      console.log('No photos selected');
      return;
    }
    
    for (const photo of this.selectedPhotos) {
      try {
        const formData = new FormData();
        
        // Convert base64 to blob
        const response = await fetch(`data:${photo.mimeType};base64,${photo.base64}`);
        const blob = await response.blob();
        
        formData.append('file', blob, photo.fileName);
        formData.append('width', photo.width.toString());
        formData.append('height', photo.height.toString());
        
        // Upload to your server
        await fetch('https://your-server.com/upload', {
          method: 'POST',
          body: formData
        });
        
        console.log(`Uploaded ${photo.fileName} successfully`);
        
      } catch (error) {
        console.error(`Failed to upload ${photo.fileName}:`, error);
      }
    }
  }
  
  // Example: Display photos in template
  getPhotoPreview(photo: any): string {
    return `data:${photo.mimeType};base64,${photo.base64}`;
  }
  
  // Example: Clear selected photos
  clearPhotos() {
    this.selectedPhotos = [];
  }
}

/* 
HTML Template (photo-picker.component.html):

<div class="photo-picker-container">
  <h2>Multi Photo Picker Example</h2>
  
  <div class="actions">
    <button (click)="pickPhotos()" class="pick-button">
      Select Photos
    </button>
    
    <button (click)="uploadPhotos()" 
            [disabled]="selectedPhotos.length === 0"
            class="upload-button">
      Upload Photos ({{ selectedPhotos.length }})
    </button>
    
    <button (click)="clearPhotos()" 
            [disabled]="selectedPhotos.length === 0"
            class="clear-button">
      Clear
    </button>
  </div>
  
  <div class="photos-grid" *ngIf="selectedPhotos.length > 0">
    <div class="photo-item" *ngFor="let photo of selectedPhotos">
      <img [src]="getPhotoPreview(photo)" [alt]="photo.fileName" />
      <div class="photo-info">
        <p><strong>{{ photo.fileName }}</strong></p>
        <p>{{ photo.width }}x{{ photo.height }}</p>
        <p>{{ (photo.fileSize / 1024).toFixed(1) }} KB</p>
      </div>
    </div>
  </div>
</div>
*/

/* 
CSS Styles (photo-picker.component.scss):

.photo-picker-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    
    &.pick-button {
      background-color: #007bff;
      color: white;
    }
    
    &.upload-button {
      background-color: #28a745;
      color: white;
    }
    
    &.clear-button {
      background-color: #dc3545;
      color: white;
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  
  .photo-item {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    text-align: center;
    
    img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 4px;
    }
    
    .photo-info {
      margin-top: 10px;
      
      p {
        margin: 5px 0;
        font-size: 12px;
        color: #666;
      }
    }
  }
}
*/ 