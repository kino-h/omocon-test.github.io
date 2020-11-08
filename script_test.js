let localStream;

// カメラ映像取得
navigator.mediaDevices.getUserMedia({video: true, audio: true})
  .then( stream => {
  // 成功時にvideo要素にカメラ映像をセットし、再生
  const videoElm = document.getElementById('my-video');
  videoElm.srcObject = stream;
  videoElm.play();
  // 着信時に相手にカメラ映像を返せるように、グローバル変数に保存しておく
  localStream = stream;
  // ミュート切替(自分)
  $(function() {
    var myaudioTrack = stream.getAudioTracks()[0];
    $('#my-mic').on('click', function() {
      if(myaudioTrack.enabled) {
        myaudioTrack.enabled = false;
      } else {
        myaudioTrack.enabled = true;
      }
    });
  });
}).catch( error => {
  // 失敗時にはエラーログを出力
  console.error('mediaDevice.getUserMedia() error:', error);
  return;
});

//Peer作成
const peer = new Peer({
key: '047c0c68-2d54-436d-8f0e-070ae4983ca5',
debug: 3
});

//PeerID取得
peer.on('open', () => {
  document.getElementById('my-id').textContent = peer.id;
});

// 発信処理
document.getElementById('make-call').onclick = () => {
const yourID = document.getElementById('your-id').value;
const mediaConnection = peer.call(yourID, localStream);
setEventListener(mediaConnection);
};

// イベントリスナを設置する関数
const setEventListener = mediaConnection => {
mediaConnection.on('stream', stream => {
  // video要素にカメラ映像をセットして再生
  const videoElm = document.getElementById('your-video')
  videoElm.srcObject = stream;
  videoElm.play();
});
}

//着信処理
peer.on('call', mediaConnection => {
mediaConnection.answer(localStream);
setEventListener(mediaConnection);
});

// 音声ON(相手)(初期設定が音声OFFのため)
$(function() {
  var yoursettings = $('#your-video').get(0);
  yoursettings.muted = false;
});

// 撮影機能
$(function() {
  var myvideo = document.getElementById('my-video');
  var yourvideo = document.getElementById('your-video');
  var mycanvas = document.getElementById('my-photo');
  var yourcanvas = document.getElementById('your-photo');
  $('#shutter').on('click', function() {
    var mycontext = mycanvas.getContext('2d');
    var yourcontext = yourcanvas.getContext('2d');

    mycanvas.width = myvideo.videoWidth;
    mycanvas.height = myvideo.videoHeight;

    yourcanvas.width = yourvideo.videoWidth;
    yourcanvas.height = yourvideo.videoHeight;

    mycontext.drawImage(myvideo, 0, 0);
    yourcontext.drawImage(yourvideo, 0, 0);
  });
});