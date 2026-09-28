<?php
/**
 * Prosty handler formularza kontaktowego.
 * Wymaga hostingu z obsługą PHP i funkcji mail() (standard na hostingu współdzielonym).
 * Jeśli mail() nie działa na Twoim hostingu, dostawca zwykle udostępnia
 * dane do wysyłki przez SMTP — wtedy trzeba podmienić funkcję mail() poniżej.
 */

$recipient = "biuro@marcelinskamyjnia.pl";
$redirect_base = "/kontakt.html";

function back($status) {
    global $redirect_base;
    header("Location: " . $redirect_base . "?" . $status . "=1");
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    back("error");
}

// Honeypot anti-spam: jeśli pole "website" jest wypełnione, to bot.
if (!empty($_POST["website"])) {
    back("sent"); // udajemy sukces, żeby nie podpowiadać botom
}

$name    = trim($_POST["name"] ?? "");
$email   = trim($_POST["email"] ?? "");
$phone   = trim($_POST["phone"] ?? "");
$subject = trim($_POST["subject"] ?? "");
$message = trim($_POST["message"] ?? "");

if ($name === "" || $email === "" || $message === "") {
    back("error");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    back("error");
}

// Zabezpieczenie przed wstrzyknięciem nagłówków e-mail.
$clean = function ($value) {
    return str_replace(["\r", "\n"], "", $value);
};
$name    = $clean($name);
$email   = $clean($email);
$phone   = $clean($phone);
$subject = $clean($subject) ?: "Wiadomość ze strony marcelinskamyjnia.pl";

$body  = "Nowa wiadomość z formularza kontaktowego:\n\n";
$body .= "Imię i nazwisko: " . $name . "\n";
$body .= "E-mail: " . $email . "\n";
$body .= "Telefon: " . ($phone !== "" ? $phone : "-") . "\n\n";
$body .= "Treść:\n" . $message . "\n";

$headers   = [];
$headers[] = "From: Formularz strony <no-reply@marcelinskamyjnia.pl>";
$headers[] = "Reply-To: " . $name . " <" . $email . ">";
$headers[] = "Content-Type: text/plain; charset=UTF-8";

$sent = mail($recipient, "[marcelinskamyjnia.pl] " . $subject, $body, implode("\r\n", $headers));

back($sent ? "sent" : "error");
