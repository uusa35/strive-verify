<?php

use App\Http\Controllers\Backend\ParticipantController;
use App\Http\Controllers\Backend\CertificateController;
use App\Http\Controllers\Frontend\FrontendCertificateController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('paricipant', ParticipantController::class);
    Route::resource('certificate', CertificateController::class);
});


Route::resource('certificate', FrontendCertificateController::class)->only('show');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
