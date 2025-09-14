<?php

namespace App\Models;

use App\Enums\ParticipantTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Participant extends Model
{
    /** @use HasFactory<\Database\Factories\ParticipantFactory> */
    use HasFactory, Searchable;
    protected $guarded = ['id'];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'type' => ParticipantTypeEnum::class,
    ];

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    public function scopeStudent($q): void
    {
        $q->where('type', ParticipantTypeEnum::STUDENT);
    }

    public function toSearchableArray()
    {
        return [
            'name' => $this->name,
            'title' => $this->title,
            'email' => $this->email,
        ];
    }
}
