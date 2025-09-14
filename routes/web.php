<?php

use App\Http\Controllers\Backend\CertificateController;
use App\Http\Controllers\Backend\HomeController;
use App\Http\Controllers\Backend\ParticipantController;
use App\Http\Controllers\Frontend\FrontendCertificateController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/dashboard', function () {
    // Redirect admin users to backend, regular users to home
    if (auth()->user() && auth()->user()->id === 1) {
        return redirect()->route('backend.home');
    }

    return redirect()->route('home');
})->middleware('auth')->name('dashboard');

Route::group(
    ['prefix' => 'backend', 'as' => 'backend.', 'middleware' => ['auth', 'verified', 'adminAccess']],
    function () {
        Route::get('home', HomeController::class)->name('home');
        Route::resource('participant', ParticipantController::class);
        Route::resource('certificate', CertificateController::class);
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    }
);

Route::resource('certificate', FrontendCertificateController::class)->only('show');
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
