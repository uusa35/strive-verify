<?php

use App\Models\Certificate;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

describe('Public Routes', function () {
    test('home route returns welcome page', function () {
        $this->get(route('home'))
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page->component('welcome'));
    });

    test('frontend certificate show route works', function () {
        $certificate = Certificate::factory()->create();

        $this->get(route('certificate.show', $certificate))
            ->assertSuccessful();
    });

    test('dashboard route redirects admin to backend', function () {
        $admin = User::factory()->create(['id' => 1]);
        $this->actingAs($admin);

        $this->get(route('dashboard'))
            ->assertRedirect(route('backend.home'));
    });

    test('dashboard route redirects regular user to home', function () {
        User::factory()->create(['id' => 1]); // Ensure admin exists
        $user = User::factory()->create(); // Regular user with ID > 1
        $this->actingAs($user);

        $this->get(route('dashboard'))
            ->assertRedirect(route('home'));
    });

    test('dashboard route requires authentication', function () {
        $this->get(route('dashboard'))
            ->assertRedirect(route('login'));
    });
});
