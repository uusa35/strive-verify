<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('participant_vectors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participant_id')->constrained()->onDelete('cascade');
            $table->text('content'); // Combined searchable content in Arabic/English
            $table->json('embedding'); // Vector embedding for similarity search
            $table->string('language', 5)->default('en'); // Language code (en, ar)
            $table->timestamp('last_updated_at')->nullable();
            $table->timestamps();

            $table->index(['participant_id', 'language']);
            $table->index('last_updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participant_vectors');
    }
};
