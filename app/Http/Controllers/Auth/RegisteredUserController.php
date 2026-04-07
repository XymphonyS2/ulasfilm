<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class RegisteredUserController
{
    /**
     * Create a new registered user and redirect to login.
     */
    public function store(Request $request, CreatesNewUsers $creator): RedirectResponse
    {
        $creator->create($request->all());

        return redirect('/login');
    }
}
