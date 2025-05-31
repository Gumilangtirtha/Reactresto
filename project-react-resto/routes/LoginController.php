<?php

namespace App\Http\Controllers;
// ...existing imports...

class LoginController extends Controller 
{
    // ...existing methods...

    public function updateStatus($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->status = request('status');
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'User status updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user status'
            ], 500);
        }
    }
}
