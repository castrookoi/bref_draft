<?php
header('Content-Type: application/json');

// Function to sanitize input
function sanitize_input($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// Initialize response array
$response = ['success' => false, 'message' => ''];

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Invalid request method.';
    echo json_encode($response);
    exit;
}

// Retrieve and sanitize form data
$name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
$phone = isset($_POST['phone']) ? sanitize_input($_POST['phone']) : '';
$interest = isset($_POST['interest']) ? sanitize_input($_POST['interest']) : '';
$quote = isset($_POST['quote']) ? 'Yes' : 'No';
$message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';

// Server-side validation
if (empty($name) || empty($email) || empty($message)) {
    $response['message'] = 'Please fill out all required fields.';
    echo json_encode($response);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response['message'] = 'Invalid email format.';
    echo json_encode($response);
    exit;
}

// Prepare email content
$to = 'info@eshuaofemarinelimited.com'; // TWEAK: Updated to match the email in offshore.html
$subject = 'New Contact Form Submission';
$body = "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Phone: $phone\n";
$body .= "Area of Interest: $interest\n";
$body .= "Request Quote: $quote\n";
$body .= "Message:\n$message\n";
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";

// Send email
if (mail($to, $subject, $body, $headers)) {
    $response['success'] = true;
    $response['message'] = 'Response has been sent';
} else {
    $response['message'] = 'Failed to send message. Please try again.';
}

// Return JSON response
echo json_encode($response);
?>