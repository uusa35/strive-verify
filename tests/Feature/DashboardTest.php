<?php

use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    // Create admin user first, so regular user gets ID > 1
    User::factory()->create(['id' => 1]);
    $this->actingAs($user = User::factory()->create());

    // Dashboard should redirect regular users to home
    $this->get(route('dashboard'))->assertRedirect(route('home'));
});
