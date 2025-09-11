<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('qr', function () {
    return response(
        QrCode::merge(public_path('images/logo_english.jpg'), 0.2, true)
            ->size(300)
            ->style('dot', 0.9)
            ->format('svg')
            ->backgroundColor(255, 255, 255)
            ->errorCorrection('H')
            ->eyeColor(0, 1, 194, 211, 0, 0, 0)
            ->eyeColor(1, 1, 194, 211, 0, 0, 0)
            ->eyeColor(2, 1, 194, 211, 0, 0, 0)
            ->generate(request()->link),
        200
    )
        ->header('Content-Type', 'image/svg+xml')
        ->header('Content-Disposition', 'attachment; filename="qrcode.svg"');
})->name('qr');


Route::get('qr-png', function () {
    $link = request()->validate([
        'link' => 'required|url'
    ])['link'];

    // Create storage directory
    $storagePath = storage_path('app/public/uploads/images/large');
    if (!File::exists($storagePath)) {
        File::makeDirectory($storagePath, 0755, true);
    }

    $filename = 'qrcode_canvas_' . time() . '_' . Str::random(8) . '.png';
    $fullPath = $storagePath . '/' . $filename;

    // Generate QR code with maximum size to fill 400x400
    $qrCodeData =   QrCode::merge(public_path('images/logo_english.jpg'), 0.2, true)
        ->size(400)
        ->style('dot', 0.9)
        ->format('png')
        ->backgroundColor(255, 255, 255)
        ->errorCorrection('H')
        ->eyeColor(0, 1, 194, 211, 0, 0, 0)
        ->eyeColor(1, 1, 194, 211, 0, 0, 0)
        ->eyeColor(2, 1, 194, 211, 0, 0, 0)
        ->generate(request()->link);

    // Create a new 400x400 canvas
    $manager = new ImageManager(Driver::class);
    $img = $manager->create(400, 400)->fill('#ffffff');

    // Create QR code ImageManager from the generated data
    $img->place($qrCodeData, 'top-left', 0, 0);
    // Save the final image
    $img->save($fullPath, 90); // 90% quality
    // Check file size and optimize if needed
    $fileSize = File::size($fullPath);
    $maxSize = 50 * 1024; // 50KB
    $quality = 90;

    while ($fileSize > $maxSize && $quality > 20) {
        $quality -= 10;
        $img->save($fullPath, $quality);
        $fileSize = File::size($fullPath);
    }

    return response()->download($fullPath, $filename, [
        'Content-Type' => 'image/png',
    ]);
})->name('qr.png');
