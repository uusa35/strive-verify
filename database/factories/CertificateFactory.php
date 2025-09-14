<?php

namespace Database\Factories;

use App\Models\Participant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Certificate>
 */
class CertificateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'content' => fake()->randomHtml(),
            'reference' => fake()->numberBetween([11111, 9999999999]),
            'path' => 'test.pdf',
            'image' => 'default.png',
            'participant_id' => Participant::factory()->create(['type' => \App\Enums\ParticipantTypeEnum::STUDENT]),
        ];
    }
}
