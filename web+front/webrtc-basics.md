# WebRTC (Web Real-Time Communication) Basics

## Table of Contents
- [What is WebRTC?](#what-is-webrtc)
- [Core APIs](#core-apis)
- [How WebRTC Works](#how-webrtc-works-the-connection-process)
- [Key Concepts](#key-concepts)
- [Complete Basic Example](#complete-basic-example)
- [Common Use Cases](#common-use-cases)
- [Browser Support](#browser-support)
- [Advantages](#advantages)
- [Challenges](#challenges)
- [Next Steps for Learning](#next-steps-for-learning)

## What is WebRTC?

WebRTC is an open-source technology that enables real-time peer-to-peer communication directly between browsers and mobile applications without requiring plugins or third-party software. It supports:
- **Audio** communication
- **Video** communication  
- **Data** transfer

## Core APIs

WebRTC consists of three main JavaScript APIs:

### 1. MediaStream API (getUserMedia)
Captures audio and video from user devices.

```typescript
async function getMediaStream(): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    return stream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
    throw error;
  }
}
```

### 2. RTCPeerConnection
Handles the peer-to-peer connection, including:
- Encoding/decoding audio and video
- Bandwidth management
- Security (encryption)
- Network traversal (NAT/firewall)

```typescript
const configuration: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
};

const peerConnection = new RTCPeerConnection(configuration);
```

### 3. RTCDataChannel
Enables bidirectional data transfer between peers.

```typescript
const dataChannel = peerConnection.createDataChannel('myChannel');

dataChannel.onopen = () => {
  console.log('Data channel is open');
  dataChannel.send('Hello from peer!');
};

dataChannel.onmessage = (event) => {
  console.log('Received message:', event.data);
};
```

## How WebRTC Works: The Connection Process

### 1. Signaling
Peers exchange connection information (not part of WebRTC itself - you must implement this):
- Session descriptions (SDP - Session Description Protocol)
- Network candidates (ICE candidates)

```typescript
// Create an offer (Peer A)
const offer = await peerConnection.createOffer();
await peerConnection.setLocalDescription(offer);
// Send offer to Peer B via signaling server

// Receive offer and create answer (Peer B)
await peerConnection.setRemoteDescription(receivedOffer);
const answer = await peerConnection.createAnswer();
await peerConnection.setLocalDescription(answer);
// Send answer back to Peer A via signaling server
```

### 2. ICE (Interactive Connectivity Establishment)
Finds the best path to connect peers through NAT/firewalls:

```typescript
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    // Send candidate to remote peer via signaling
    sendToSignalingServer({
      type: 'ice-candidate',
      candidate: event.candidate
    });
  }
};

// When receiving ICE candidate from remote peer
peerConnection.addIceCandidate(receivedCandidate);
```

### 3. Connection Types
- **STUN Server**: Discovers public IP address
- **TURN Server**: Relays traffic when direct connection fails
- **Direct P2P**: Best scenario, direct connection between peers

## Key Concepts

### SDP (Session Description Protocol)
Text-based format describing:
- Media capabilities (codecs, resolutions)
- Network information
- Security parameters

### ICE Candidates
Potential network addresses where a peer can be reached:
- **Host candidate**: Local IP address
- **Server reflexive candidate**: Public IP (via STUN)
- **Relay candidate**: TURN server address

## Complete Basic Example

```typescript
interface SignalMessage {
  type: 'offer' | 'answer' | 'ice-candidate';
  data: RTCSessionDescriptionInit | RTCIceCandidate;
}

class WebRTCConnection {
  private peerConnection: RTCPeerConnection;
  private localStream?: MediaStream;

  constructor(private signalingService: SignalingService) {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: 'turn:your-turn-server.com',
          username: 'user',
          credential: 'password'
        }
      ]
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.signalingService.send({
          type: 'ice-candidate',
          data: event.candidate
        });
      }
    };

    // Handle incoming tracks
    this.peerConnection.ontrack = (event) => {
      const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
      if (remoteVideo) {
        remoteVideo.srcObject = event.streams[0];
      }
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', this.peerConnection.connectionState);
    };
  }

  async startCall(): Promise<void> {
    // Get local media
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    // Add tracks to peer connection
    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream!);
    });

    // Create and send offer
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    
    this.signalingService.send({
      type: 'offer',
      data: offer
    });
  }

  async handleSignal(message: SignalMessage): Promise<void> {
    switch (message.type) {
      case 'offer':
        await this.handleOffer(message.data as RTCSessionDescriptionInit);
        break;
      case 'answer':
        await this.handleAnswer(message.data as RTCSessionDescriptionInit);
        break;
      case 'ice-candidate':
        await this.peerConnection.addIceCandidate(
          message.data as RTCIceCandidate
        );
        break;
    }
  }

  private async handleOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    await this.peerConnection.setRemoteDescription(offer);
    
    // Get local media
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream!);
    });

    // Create and send answer
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    
    this.signalingService.send({
      type: 'answer',
      data: answer
    });
  }

  private async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    await this.peerConnection.setRemoteDescription(answer);
  }

  disconnect(): void {
    this.localStream?.getTracks().forEach(track => track.stop());
    this.peerConnection.close();
  }
}
```

## Angular WebRTC Service Example

```typescript
import { Injectable, inject, signal } from '@angular/core';

interface WebRTCConfig {
  iceServers: RTCIceServer[];
}

@Injectable({
  providedIn: 'root'
})
export class WebrtcService {
  private peerConnection = signal<RTCPeerConnection | null>(null);
  private localStream = signal<MediaStream | null>(null);
  private remoteStream = signal<MediaStream | null>(null);
  
  readonly connectionState = signal<RTCPeerConnectionState>('new');

  private readonly defaultConfig: WebRTCConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  };

  initializePeerConnection(config?: WebRTCConfig): void {
    const configuration = config ?? this.defaultConfig;
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('New ICE candidate:', event.candidate);
      }
    };

    pc.ontrack = (event) => {
      this.remoteStream.set(event.streams[0]);
    };

    pc.onconnectionstatechange = () => {
      this.connectionState.set(pc.connectionState);
    };

    this.peerConnection.set(pc);
  }

  async getLocalStream(constraints?: MediaStreamConstraints): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        constraints ?? { video: true, audio: true }
      );
      this.localStream.set(stream);
      
      // Add tracks to peer connection
      const pc = this.peerConnection();
      if (pc) {
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });
      }
      
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    const pc = this.peerConnection();
    if (!pc) {
      throw new Error('Peer connection not initialized');
    }

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(): Promise<RTCSessionDescriptionInit> {
    const pc = this.peerConnection();
    if (!pc) {
      throw new Error('Peer connection not initialized');
    }

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
  }

  async setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
    const pc = this.peerConnection();
    if (!pc) {
      throw new Error('Peer connection not initialized');
    }

    await pc.setRemoteDescription(description);
  }

  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    const pc = this.peerConnection();
    if (!pc) {
      throw new Error('Peer connection not initialized');
    }

    await pc.addIceCandidate(candidate);
  }

  disconnect(): void {
    const stream = this.localStream();
    stream?.getTracks().forEach(track => track.stop());

    const pc = this.peerConnection();
    pc?.close();

    this.localStream.set(null);
    this.remoteStream.set(null);
    this.peerConnection.set(null);
    this.connectionState.set('closed');
  }

  getLocalStream(): MediaStream | null {
    return this.localStream();
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream();
  }
}
```

## Common Use Cases

1. **Video Conferencing** (Zoom, Google Meet)
2. **Voice Calls** (Discord, WhatsApp Web)
3. **Screen Sharing**
4. **File Transfer** (via DataChannel)
5. **Gaming** (low-latency multiplayer)
6. **Live Broadcasting**

## Browser Support

WebRTC is supported in:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (with some limitations)
- ✅ Opera
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Advantages

- **Low Latency**: Direct peer-to-peer communication
- **No Plugins**: Native browser support
- **Encrypted**: Built-in encryption (DTLS/SRTP)
- **Adaptive**: Automatic quality adjustment based on network
- **Cross-platform**: Works on desktop and mobile

## Challenges

- **Signaling**: Must implement your own signaling mechanism (WebSocket, Socket.io, etc.)
- **NAT Traversal**: Requires STUN/TURN servers for connections behind firewalls
- **Browser Compatibility**: Some API differences between browsers
- **Scalability**: P2P doesn't scale well for large groups (need SFU/MCU)
- **Network Quality**: Quality depends on users' internet connections

## Security Considerations

- **Encryption**: All WebRTC connections are encrypted by default (DTLS for data, SRTP for media)
- **Permissions**: Browser requires user permission to access camera/microphone
- **CORS**: Be aware of cross-origin restrictions
- **Secure Signaling**: Use WSS (WebSocket Secure) for signaling

## Next Steps for Learning

1. **Basic Implementation**
   - Implement a simple peer-to-peer video chat
   - Create a local video preview

2. **Signaling**
   - Learn about signaling with WebSockets
   - Implement a signaling server (Node.js + Socket.io)

3. **STUN/TURN**
   - Understand STUN/TURN server setup
   - Configure ICE servers properly

4. **Advanced Topics**
   - Study SFU (Selective Forwarding Unit) architecture
   - Learn about MCU (Multipoint Control Unit)
   - Explore media constraints and quality optimization
   - Implement screen sharing
   - Add data channel functionality

5. **Production Considerations**
   - Error handling and recovery
   - Connection quality monitoring
   - Bandwidth management
   - Recording capabilities

## Useful Resources

- [MDN WebRTC API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [WebRTC Official Website](https://webrtc.org/)
- [WebRTC Samples](https://webrtc.github.io/samples/)
- [Google Codelab: Real-time communication with WebRTC](https://codelabs.developers.google.com/codelabs/webrtc-web)

## WebRTC Architecture Patterns

### Mesh (P2P)
- Each peer connects to every other peer
- Best for: 2-4 participants
- Pros: Low latency, simple
- Cons: Doesn't scale, high bandwidth usage

### SFU (Selective Forwarding Unit)
- Central server forwards streams without processing
- Best for: 5-50 participants
- Pros: Scalable, lower bandwidth per client
- Cons: Requires server infrastructure

### MCU (Multipoint Control Unit)
- Server mixes all streams into one
- Best for: Large conferences
- Pros: Very low client bandwidth
- Cons: High server CPU, added latency

## Connection States

```typescript
type RTCPeerConnectionState = 
  | 'new'          // Initial state
  | 'connecting'   // ICE/DTLS negotiation in progress
  | 'connected'    // Connection established and working
  | 'disconnected' // Temporarily lost connection
  | 'failed'       // Connection failed, will not recover
  | 'closed';      // Connection closed by calling close()
```

## Media Constraints Examples

```typescript
// HD Video
const hdConstraints: MediaStreamConstraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 }
  },
  audio: true
};

// Screen sharing
const screenConstraints: MediaStreamConstraints = {
  video: {
    cursor: 'always'
  },
  audio: false
};

// Audio only
const audioConstraints: MediaStreamConstraints = {
  video: false,
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  }
};
```








