<?php

namespace App\Http\Middleware;

class ErrorHandler
{
    /**
     * Format error response
     *
     * @param string $message Error message
     * @param int $code HTTP status code
     * @param array $errors Additional error details
     * @return void
     */
    public static function handle($message, $code = 500, $errors = [])
    {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'message' => $message,
            'errors' => $errors
        ]);
        exit;
    }

    /**
     * Handle uncaught exceptions
     *
     * @param \Throwable $e The exception
     * @return void
     */
    public static function handleException($e)
    {
        error_log($e->getMessage());
        
        self::handle(
            'An unexpected error occurred.',
            500,
            [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'message' => $e->getMessage()
            ]
        );
    }
}
