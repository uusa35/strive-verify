<?php

namespace App\Enums;

enum ParticipantTypeEnum: string
{
    case STUDENT = 'student';
    case EMPLOYEE = 'employee';
    case TEACHER = 'teacher';


    // extra helper to allow for greater customization of displayed values, without disclosing the name/value data directly
    public function label(): string
    {
        return match ($this) {
            static::STUDENT => 'student',
            static::EMPLOYEE => 'employee',
            static::TEACHER => 'teacher',
        };
    }

    public function keyLabels(): array
    {
        return array_reduce(self::cases(), function ($carry,  $item) {
            $carry[$item->value] = $item->label();
            return $carry;
        }, []);
    }
}
