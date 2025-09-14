<?php

use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

describe('Guest Authentication Routes', function () {
    test('register form page works', function () {
        $this->get(route('register'))
            ->assertSuccessful();
    });

    test('register POST works with valid data', function () {
        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ];

        $this->post(route('register.store'), $userData)
            ->assertRedirect();

        $this->assertDatabaseHas('users', [
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    });

    test('login form page works', function () {
        $this->get(route('login'))
            ->assertSuccessful();
    });

    test('login POST works with valid credentials', function () {
        $user = User::factory()->create();

        $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'password',
        ])->assertRedirect();

        $this->assertAuthenticated();
    });

    test('forgot password form page works', function () {
        $this->get(route('password.request'))
            ->assertSuccessful();
    });

    test('forgot password POST works', function () {
        $user = User::factory()->create();

        $this->post(route('password.email'), [
            'email' => $user->email,
        ])->assertRedirect();
    });

    test('reset password form page works', function () {
        $this->get(route('password.reset', 'token'))
            ->assertSuccessful();
    });

    test('reset password POST works', function () {
        $user = User::factory()->create();

        $this->post(route('password.store'), [
            'token' => 'valid-token',
            'email' => $user->email,
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword',
        ])->assertRedirect();
    });

    test('authenticated users are redirected from guest routes', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->get(route('register'))->assertRedirect();
        $this->get(route('login'))->assertRedirect();
        $this->get(route('password.request'))->assertRedirect();
    });
});

describe('Authenticated User Routes', function () {
    test('email verification notice page works', function () {
        $user = User::factory()->create(['email_verified_at' => null]);
        $this->actingAs($user);

        $this->get(route('verification.notice'))
            ->assertSuccessful();
    });

    test('email verification works', function () {
        $user = User::factory()->create(['email_verified_at' => null]);
        $this->actingAs($user);

        $verificationUrl = \Illuminate\Support\Facades\URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        $this->get($verificationUrl)
            ->assertRedirect();
    });

    test('resend verification email works', function () {
        $user = User::factory()->create(['email_verified_at' => null]);
        $this->actingAs($user);

        $this->post(route('verification.send'))
            ->assertRedirect();
    });

    test('confirm password form page works', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->get(route('password.confirm'))
            ->assertSuccessful();
    });

    test('confirm password POST works', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->post(route('password.confirm.store'), [
            'password' => 'password',
        ])->assertRedirect();
    });

    test('logout works', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->post(route('logout'))
            ->assertRedirect();

        $this->assertGuest();
    });

    test('guests cannot access authenticated routes', function () {
        $this->get(route('verification.notice'))->assertRedirect(route('login'));
        $this->get(route('password.confirm'))->assertRedirect(route('login'));
        $this->post(route('logout'))->assertRedirect(route('login'));
    });
});
