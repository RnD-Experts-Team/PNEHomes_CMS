<?php

// app/Traits/HasMediaUrl.php
namespace App\Traits;

trait HasMediaUrl
{
    public function resolveMediaUrl(?string $id, string $type): ?string
    {
        if (!$id)
            return null;

        return match ($type) {
            'video' => config('media.video_base_url') . '/' . $id . '/preview',
            default => config('media.image_base_url') . '/' . $id,
        };
    }
}
