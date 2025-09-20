![archi](https://github.com/user-attachments/assets/48581ac2-ee2d-4623-a78b-fd0a4231f7f9)# Pose-Fit_FYP
The fitness industry has undergone a significant digital transformation due to technological advancements and changing consumer needs. However, maintaining a healthy lifestyle remains challenging due to factors like time, limited access to fitness centers, transportation issues, and high gym membership costs. The global pandemic has emphasized the importance of home-based fitness solutions, but most current solutions lack real-time posture correction or personalized feedback, leading to ineffective exercise routines and increased injury risk. PoseFit, a web-based fitness assistant, combines machine learning, computer vision, and real-time pose estimation to provide real-time feedback, posture correction, and motivation.

PoseFit uses advanced machine learning models such as MoveNet from TensorFlow.js to
detect 17 key body landmarks (shoulders, hips, knees) in real-time. Unlike conventional fitness
apps, PoseFit emphasizes privacy-first architecture by running all processing directly in the
browser. This ensures that video feeds are never transmitted or stored, maintaining user data
privacy. The frontend of the application is built using React.js, while backend services manage
user data, progress tracking, and community features using Node.js and MongoDB.
PoseFit addresses several important needs in the fitness domain:

* It lowers the barrier to entry by being browser-based and free from expensive equipment requirements.
* It increases safety and effectiveness by giving real-time feedback and alerts when incorrect posture is detected.
* It enhances motivation through community engagement tools such as leader-boards and challenges.
* It supports a variety of exercises including squats, lunges, push-ups, jumping jacks, and dumbbell curls.

Below is the demonstration video: 
https://drive.google.com/file/d/1MkOf6KBNRdk7i-mw9fdhfKMawhqygJTH/view?usp=sharing 


Below is the Architectural design:

<img width="1163" height="829" alt="image" src="https://github.com/user-attachments/assets/95257c0a-f2e7-4b69-b36a-48b311d7c92a" />



