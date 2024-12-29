<?php
// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the form data
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    $email = isset($_POST['email']) ? $_POST['email'] : '';
    $phone = isset($_POST['phone']) ? $_POST['phone'] : '';
    $project = isset($_POST['project']) ? $_POST['project'] : '';
    $subject = isset($_POST['subject']) ? $_POST['subject'] : '';
    $message = isset($_POST['message']) ? $_POST['message'] : '';

    // Basic validation
    if (!empty($name) && !empty($email) && !empty($message)) {
        // Send email (customize the recipient and headers)
        $to = 'your-email@example.com';  // Your email address
        $subjectLine = "New Message: $subject";
        $messageBody = "You have received a new message from $name ($email, $phone).\n\nProject: $project\nMessage:\n$message";

        $headers = "From: $email\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        // Send the email
        if (mail($to, $subjectLine, $messageBody, $headers)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error sending email.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
