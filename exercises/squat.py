import cv2
from pose_estimation.angle_calculation import calculate_angle

class Squat:
    def __init__(self):
        self.counter = 0
        self.stage = None

    def calculate_angle(self, hip, knee, ankle):
        return calculate_angle(hip, knee, ankle)

    def get_color_based_on_angle(self, angle):
        # You can adjust thresholds here
        if 85 <= angle <= 105:
            return (0, 255, 0)  # Green - Good form
        elif 70 <= angle < 85 or 105 < angle <= 120:
            return (0, 255, 255)  # Yellow - Caution
        else:
            return (0, 0, 255)  # Red - Poor form

    def track_squat(self, landmarks, frame):
        # Landmark coordinates
        hip = [int(landmarks[23].x * frame.shape[1]), int(landmarks[23].y * frame.shape[0])]
        knee = [int(landmarks[25].x * frame.shape[1]), int(landmarks[25].y * frame.shape[0])]
        shoulder = [int(landmarks[11].x * frame.shape[1]), int(landmarks[11].y * frame.shape[0])]

        hip_right = [int(landmarks[24].x * frame.shape[1]), int(landmarks[24].y * frame.shape[0])]
        knee_right = [int(landmarks[26].x * frame.shape[1]), int(landmarks[26].y * frame.shape[0])]
        shoulder_right = [int(landmarks[12].x * frame.shape[1]), int(landmarks[12].y * frame.shape[0])]

        # Calculate angles
        angle = self.calculate_angle(shoulder, hip, knee)
        angle_right = self.calculate_angle(shoulder_right, hip_right, knee_right)

        # Dynamically determine colors based on angle accuracy
        left_color = self.get_color_based_on_angle(angle)
        right_color = self.get_color_based_on_angle(angle_right)

        # Draw lines
        self.draw_line_with_style(frame, shoulder, hip, left_color, 2)
        self.draw_line_with_style(frame, hip, knee, left_color, 2)
        self.draw_line_with_style(frame, shoulder_right, hip_right, right_color, 2)
        self.draw_line_with_style(frame, hip_right, knee_right, right_color, 2)

        # Draw circles
        self.draw_circle(frame, shoulder, left_color, 8)
        self.draw_circle(frame, hip, left_color, 8)
        self.draw_circle(frame, knee, left_color, 8)
        self.draw_circle(frame, shoulder_right, right_color, 8)
        self.draw_circle(frame, hip_right, right_color, 8)
        self.draw_circle(frame, knee_right, right_color, 8)

        # Display angles on screen
        angle_text_position = (knee[0] + 10, knee[1] - 10)
        angle_text_position_right = (knee_right[0] + 10, knee_right[1] - 10)
        cv2.putText(frame, f'Angle Left: {int(angle)}', angle_text_position, cv2.FONT_HERSHEY_SIMPLEX, 0.5, left_color, 2)
        cv2.putText(frame, f'Angle Right: {int(angle_right)}', angle_text_position_right, cv2.FONT_HERSHEY_SIMPLEX, 0.5, right_color, 2)

        # Update exercise stage and counter
        if angle > 170:
            self.stage = "Starting Position"
        elif 90 < angle < 170 and self.stage == "Starting Position":
            self.stage = "Descent"
        elif angle < 90 and self.stage == "Descent":
            self.stage = "Ascent"
            self.counter += 1

        return self.counter, angle, self.stage

    def draw_line_with_style(self, frame, start_point, end_point, color, thickness):
        cv2.line(frame, start_point, end_point, color, thickness, lineType=cv2.LINE_AA)

    def draw_circle(self, frame, center, color, radius):
        cv2.circle(frame, center, radius, color, -1)
