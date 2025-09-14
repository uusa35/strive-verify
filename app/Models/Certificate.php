<?php

namespace App\Models;

use App\Casts\ImageLargeCast;
use App\Casts\ImageQrCast;
use App\Casts\PathCast;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class Certificate extends Model
{
    /** @use HasFactory<\Database\Factories\CertificateFactory> */
    use HasFactory, Searchable;

    protected $guarded = ['id'];

    protected $appends = ['large'];

    protected $casts = [
        'active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'path' => PathCast::class,
        'large' => ImageLargeCast::class,
        'qr' => ImageQrCast::class,
    ];

    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }

    public function toSearchableArray()
    {
        return [
            'title' => $this->title,
            'content' => $this->content,
            'reference' => $this->reference,
        ];
    }
}
