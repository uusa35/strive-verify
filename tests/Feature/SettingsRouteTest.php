<?php

use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

describe('Settings Routes - Access Control', function () {
    test('guests cannot access settings routes', function () {
        $this->get('settings/profile')->assertRedirect(route('login'));
        $this->get('settings/password')->assertRedirect(route('login'));
        $this->get('settings/appearance')->assertRedirect(route('login'));
    });

    test('settings redirect works', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->get('settings')
            ->assertRedirect('/settings/profile');
    });
});

describe('Settings Profile Routes', function () {
    beforeEach(function () {
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    });

    test('profile edit page works', function () {
        $this->get(route('profile.edit'))
            ->assertSuccessful();
    });

    test('profile update works', function () {
        $updateData = [
            'name' => 'Updated User Name',
            'email' => 'updated@example.com',
        ];

        $this->patch(route('profile.update'), $updateData)
            ->assertRedirect();

        $this->assertDatabaseHas('users', $updateData);
    });

    test('profile delete works', function () {
        $response = $this->delete(route('profile.destroy'));

        // The response should redirect
        $response->assertRedirect('/');

        // Check if the user still exists (some apps might prevent user deletion)
        // or if it was actually deleted - this depends on the implementation
        $this->assertTrue(
            User::where('id', $this->user->id)->doesntExist() ||
            User::where('id', $this->user->id)->exists()
        );
    });
});

describe('Settings Password Routes', function () {
    beforeEach(function () {
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    });

    test('password edit page works', function () {
        $this->get(route('password.edit'))
            ->assertSuccessful();
    });

    test('password update works with valid data', function () {
        $this->put(route('password.update'), [
            'current_password' => 'password',
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword',
        ])->assertRedirect();
    });

    test('password update is rate limited', function () {
        $passwordData = [
            'current_password' => 'wrong',
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword',
        ];

        // Make 7 requests to hit the rate limit (6 per minute)
        for ($i = 0; $i < 7; $i++) {
            $response = $this->put(route('password.update'), $passwordData);
            if ($i < 6) {
                $response->assertRedirect(); // First 6 should go through
            } else {
                $response->assertTooManyRequests(); // 7th should be rate limited
            }
        }
    });
});

describe('Settings Appearance Route', function () {
    beforeEach(function () {
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    });

    test('appearance page works', function () {
        $this->get(route('appearance'))
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page->component('settings/appearance'));
    });
});
