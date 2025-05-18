document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const music = document.getElementById('exercise-music');
    const avatarButtons = document.querySelectorAll('.avatar-buttons .exercise-option');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const setsInput = document.getElementById('sets');
    const repsInput = document.getElementById('reps');
    const currentExercise = document.getElementById('current-exercise');
    const currentSet = document.getElementById('current-set');
    const currentReps = document.getElementById('current-reps');
    const modelViewer = document.getElementById('avatar-model');

    // Variables
    let selectedExercise = null;
    let workoutRunning = false;
    let statusCheckInterval = null;

function speakInstruction(text) {
    if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;

        // Cancel any ongoing speech before speaking new instruction
        synth.cancel();

        const voices = synth.getVoices();
        const utterance = new SpeechSynthesisUtterance(text);

        const preferredVoice = voices.find(voice =>
            voice.lang.toLowerCase().includes('en-in') ||
            voice.name.toLowerCase().includes('sri lanka') || 
            voice.lang.toLowerCase().includes('en-gb') 
        );

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.lang = preferredVoice?.lang || 'en-GB';
        utterance.rate = 0.65; 
        utterance.pitch = 1;   
        utterance.volume = 1;  

        setTimeout(() => {
            synth.speak(utterance);
        }, 200);
    }
}

    avatarButtons.forEach(button => {
        button.addEventListener('click', function () {
            avatarButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');

            selectedExercise = this.getAttribute('data-exercise');

            let modelPath = '';
            let instruction = '';

            switch (selectedExercise) {
                case 'squat':
                    modelPath = '/static/models/Air Squat.glb';
                    instruction = "Let's start with squats! Stand tall with your feet shoulder-width apart. Now bend your knees and push your hips back—like you're sitting in a chair. Stop once your hips drop just below your knees. Great! Now press through your heels and return to the top. Keep going and feel that burn!";
                    break;
                case 'push_up':
                    modelPath = '/static/models/Push Up.glb';
                    instruction = "Time for push-ups! Lie face down with your hands under your shoulders, just a little wider. Stretch your legs back and keep your body in a straight line. Lower your chest slowly toward the ground by bending your elbows. Now push up—one second up, pause, two seconds down. Steady and strong.";
                    break;
                case 'hammer_curl':
                    modelPath = '/static/models/Bicep Curl.glb';
                    instruction = "Let's begin hammer curls! Stand up straight, feet hip-width apart. Hold the dumbbells with your palms facing your thighs. Now bend your elbows and lift the weights toward your shoulders. Pause at the top. Lower slowly back down. Nice and controlled. Keep those elbows tucked in.";
                    break;
            }

            if (modelPath) {
                modelViewer.setAttribute('src', modelPath);
                modelViewer.style.display = 'block';
            }

            if (currentExercise) {
                currentExercise.textContent = selectedExercise.replace('_', ' ').toUpperCase();
            }

            if (instruction) {
                speakInstruction(instruction);
            }
        });
    });

    // Start workout
    startBtn.addEventListener('click', function () {
        if (!selectedExercise) {
            alert('Please select an exercise first!');
            return;
        }

        const sets = parseInt(setsInput.value);
        const reps = parseInt(repsInput.value);

        if (isNaN(sets) || sets < 1 || isNaN(reps) || reps < 1) {
            alert('Please enter valid numbers for sets and repetitions.');
            return;
        }

        fetch('/start_exercise', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                exercise_type: selectedExercise,
                sets: sets,
                reps: reps
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    workoutRunning = true;
                    startBtn.disabled = true;
                    stopBtn.disabled = false;

                    currentSet.textContent = `1 / ${sets}`;
                    currentReps.textContent = `0 / ${reps}`;

                    // ✅ Play the music
                    if (music) {
                        music.currentTime = 0;
                        music.play().catch(err => {
                            console.error('Music playback failed:', err);
                        });
                    }

                    statusCheckInterval = setInterval(checkStatus, 1000);
                } else {
                    alert('Failed to start exercise: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while starting the exercise.');
            });
    });

    // Stop workout
    stopBtn.addEventListener('click', function () {
        fetch('/stop_exercise', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    resetWorkoutUI(); // Music stop handled inside
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    // Function to check status
    function checkStatus() {
        fetch('/get_status')
            .then(response => response.json())
            .then(data => {
                if (!data.exercise_running && workoutRunning) {
                    resetWorkoutUI();
                    return;
                }

                currentSet.textContent = `${data.current_set} / ${data.total_sets}`;
                currentReps.textContent = `${data.current_reps} / ${data.rep_goal}`;
            })
            .catch(error => {
                console.error('Error checking status:', error);
            });
    }

    // Reset UI after workout ends
    function resetWorkoutUI() {
        workoutRunning = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;

        if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
            statusCheckInterval = null;
        }

        currentExercise.textContent = 'None';
        currentSet.textContent = '0 / 0';
        currentReps.textContent = '0 / 0';

        // ✅ Stop and reset music
        if (music) {
            music.pause();
            music.currentTime = 0;
        }
    }
});
