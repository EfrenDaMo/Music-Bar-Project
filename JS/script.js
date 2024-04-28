document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const audioContext = new AudioContext();
    let analyser = audioContext.createAnalyser();
    let audioPlayer = document.createElement('audio');
    let isPlaying = false;

    // Manage fileupload
    document.getElementById('FileUpload').addEventListener('change', function() {
        let file = this.files[0];
        if (file) {
            // Gets file name and sets it as the title
            var fileName = file.name;
            var baseName = fileName.substring(0, fileName.lastIndexOf('.'));
            document.getElementById('simpleTitle').textContent = baseName;

            // Black Magic
            audioPlayer.src = URL.createObjectURL(file);
            let source = audioContext.createMediaElementSource(audioPlayer);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
        }
    });

    // Manage playing of audio
    document.getElementById('Play').addEventListener('click', function() {
        if (!isPlaying) {
            // Makes play button play audio
            audioPlayer.play();
            isPlaying = true;
        } else {
            // Makes play button pause audio
            audioPlayer.pause();
            isPlaying = false;
            resetBars();
        }
    });

    // Manage bar height reset
    function resetBars() {
        const bars = document.querySelectorAll('.Bars');
        bars.forEach(bar => {
            bar.style.height = '6%';
        });
    }

    // Manage bar animation
    function animateBars() {
        // Determine if audio playing
        if (!isPlaying) return;
        
        // Volume analyser parts
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        // Animation parts
        const bars = document.querySelectorAll('.Bars');
        bars.forEach((bar, index) => {
            let volume = dataArray[index] / 255;
            let baseHeight = volume * 70;
            let variation = (Math.random() * 10) - 5;
            let newHeight = baseHeight + variation;
            newHeight = Math.max(0, Math.min(100, newHeight));

            bar.style.height = `${newHeight}%`;
        });
    }

    // Manages the bar update every 100 ms
    setInterval(animateBars, 100);
});
