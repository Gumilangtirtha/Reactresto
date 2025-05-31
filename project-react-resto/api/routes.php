<?php

/**
 * Order Routes
 */

// List all orders
if ($_SERVER['REQUEST_METHOD'] === 'GET' && preg_match('/^\/api\/orders$/', $_SERVER['REQUEST_URI'])) {
    $controller = new OrderController();
    $controller->index();
}

// Get single order with details
if ($_SERVER['REQUEST_METHOD'] === 'GET' && preg_match('/^\/api\/orders\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $controller = new OrderController();
    $controller->show($matches[1]);
}

// Create new order
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/api/orders') {
    $controller = new OrderController();
    $controller->store(new Request());
}

// Update order status
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && preg_match('/^\/api\/orders\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $controller = new OrderController();
    $controller->update(new Request(), $matches[1]);
}

/**
 * Order Detail Routes
 */

// List details for an order
if ($_SERVER['REQUEST_METHOD'] === 'GET' && preg_match('/^\/api\/orders\/(\d+)\/details$/', $_SERVER['REQUEST_URI'], $matches)) {
    $controller = new DetailController();
    $controller->index($matches[1]);
}

// Add detail to order
if ($_SERVER['REQUEST_METHOD'] === 'POST' && preg_match('/^\/api\/orders\/(\d+)\/details$/', $_SERVER['REQUEST_URI'], $matches)) {
    $controller = new DetailController();
    $controller->store(new Request(), $matches[1]);
}

// Update order detail
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && preg_match('/^\/api\/orders\/(\d+)\/details\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $controller = new DetailController();
    $controller->update(new Request(), $matches[1], $matches[2]);
}

// Delete order detail
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && preg_match('/^\/api\/orders\/(\d+)\/details\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $controller = new DetailController();
    $controller->destroy($matches[1], $matches[2]);
}

// If no route matches, return 404
http_response_code(404);
echo json_encode([
    'success' => false,
    'message' => 'Route not found'
]);
