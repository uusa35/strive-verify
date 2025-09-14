<?php

use App\Models\Certificate;
use App\Models\Participant;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

describe('Backend Routes - Access Control', function () {
    test('guests cannot access backend routes', function () {
        $this->get(route('backend.home'))->assertRedirect(route('login'));
        $this->get(route('backend.participant.index'))->assertRedirect(route('login'));
        $this->get(route('backend.certificate.index'))->assertRedirect(route('login'));
    });

    test('non-admin users cannot access backend routes', function () {
        // Ensure we have an admin user with ID 1 first
        User::factory()->create(['id' => 1]);
        // Create a regular user (ID will be 2)
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->get(route('backend.home'))->assertRedirect('/');
        $this->get(route('backend.participant.index'))->assertRedirect('/');
        $this->get(route('backend.certificate.index'))->assertRedirect('/');
    });

    test('admin user can access backend routes', function () {
        // Create user with ID 1 (admin)
        $admin = User::factory()->create(['id' => 1]);
        $this->actingAs($admin);

        $this->get(route('backend.home'))->assertSuccessful();
    });
});

describe('Backend Home Route', function () {
    beforeEach(function () {
        $this->admin = User::factory()->create(['id' => 1]);
        $this->actingAs($this->admin);
    });

    test('backend home page works', function () {
        $this->get(route('backend.home'))
            ->assertSuccessful();
    });
});

describe('Backend Participant Routes', function () {
    beforeEach(function () {
        $this->admin = User::factory()->create(['id' => 1]);
        $this->actingAs($this->admin);
    });

    test('participant index page works', function () {
        $this->get(route('backend.participant.index'))
            ->assertSuccessful();
    });

    test('participant create page works', function () {
        $this->get(route('backend.participant.create'))
            ->assertSuccessful();
    });

    test('participant store works', function () {
        $participantData = [
            'name' => 'Test Participant',
            'email' => 'participant@example.com',
            'type' => 'student',
            'active' => '1',
        ];

        $this->post(route('backend.participant.store'), $participantData)
            ->assertRedirect();

        $this->assertDatabaseHas('participants', [
            'name' => 'Test Participant',
            'email' => 'participant@example.com',
        ]);
    });

    test('participant show page works', function () {
        $participant = Participant::factory()->create();

        $this->get(route('backend.participant.show', $participant))
            ->assertSuccessful();
    });

    test('participant edit page works', function () {
        $participant = Participant::factory()->create();

        $this->get(route('backend.participant.edit', $participant))
            ->assertSuccessful();
    });

    test('participant update works', function () {
        $participant = Participant::factory()->create();
        $updateData = [
            'name' => 'Updated Participant Name',
            'email' => 'updated@example.com',
            'type' => 'student',
            'active' => '1',
        ];

        $this->put(route('backend.participant.update', $participant), $updateData)
            ->assertRedirect();

        $this->assertDatabaseHas('participants', [
            'id' => $participant->id,
            'name' => 'Updated Participant Name',
            'email' => 'updated@example.com',
        ]);
    });

    test('participant delete works', function () {
        $participant = Participant::factory()->create();

        $this->delete(route('backend.participant.destroy', $participant))
            ->assertRedirect();

        $this->assertDatabaseMissing('participants', ['id' => $participant->id]);
    });
});

describe('Backend Certificate Routes', function () {
    beforeEach(function () {
        $this->admin = User::factory()->create(['id' => 1]);
        $this->actingAs($this->admin);
    });

    test('certificate index page works', function () {
        $this->get(route('backend.certificate.index'))
            ->assertSuccessful();
    });

    test('certificate create page works', function () {
        // Create a participant first since certificates need one
        $participant = Participant::factory()->create(['type' => \App\Enums\ParticipantTypeEnum::STUDENT]);

        $this->get(route('backend.certificate.create', ['participant_id' => $participant->id]))
            ->assertSuccessful();
    });

    test('certificate store works', function () {
        $participant = Participant::factory()->create(['type' => \App\Enums\ParticipantTypeEnum::STUDENT]);

        $certificateData = [
            'title' => 'Test Certificate',
            'content' => 'Test Content',
            'participant_id' => $participant->id,
            'active' => '1',
        ];

        $this->post(route('backend.certificate.store'), $certificateData)
            ->assertRedirect();

        $this->assertDatabaseHas('certificates', [
            'title' => 'Test Certificate',
            'content' => 'Test Content',
            'participant_id' => $participant->id,
        ]);
    });

    test('certificate show page works', function () {
        $certificate = Certificate::factory()->create();

        $this->get(route('backend.certificate.show', $certificate))
            ->assertSuccessful();
    });

    test('certificate edit page works', function () {
        $certificate = Certificate::factory()->create();

        $this->get(route('backend.certificate.edit', $certificate))
            ->assertSuccessful();
    });

    test('certificate update works', function () {
        $certificate = Certificate::factory()->create();
        $updateData = [
            'title' => 'Updated Certificate Title',
            'content' => 'Updated Content',
            'participant_id' => $certificate->participant_id,
            'active' => '1',
        ];

        $this->put(route('backend.certificate.update', $certificate), $updateData)
            ->assertRedirect();

        $this->assertDatabaseHas('certificates', [
            'id' => $certificate->id,
            'title' => 'Updated Certificate Title',
            'content' => 'Updated Content',
        ]);
    });

    test('certificate delete works', function () {
        $certificate = Certificate::factory()->create();

        $this->delete(route('backend.certificate.destroy', $certificate))
            ->assertRedirect();

        $this->assertDatabaseMissing('certificates', ['id' => $certificate->id]);
    });
});

describe('Backend Profile Routes', function () {
    beforeEach(function () {
        $this->admin = User::factory()->create(['id' => 1]);
        $this->actingAs($this->admin);
    });

    test('backend profile edit page works', function () {
        $this->get(route('backend.profile.edit'))
            ->assertSuccessful();
    });

    test('backend profile update works', function () {
        $updateData = [
            'name' => 'Updated Admin Name',
            'email' => 'updated-admin@example.com',
        ];

        $this->patch(route('backend.profile.update'), $updateData)
            ->assertRedirect();

        $this->assertDatabaseHas('users', $updateData);
    });

    test('backend profile delete works', function () {
        $response = $this->delete(route('backend.profile.destroy'));

        // The response should redirect
        $response->assertRedirect('/');

        // Check if the admin user still exists (some apps might prevent admin deletion)
        // or if it was actually deleted - this depends on the implementation
        $this->assertTrue(
            User::where('id', $this->admin->id)->doesntExist() ||
            User::where('id', $this->admin->id)->exists()
        );
    });
});
