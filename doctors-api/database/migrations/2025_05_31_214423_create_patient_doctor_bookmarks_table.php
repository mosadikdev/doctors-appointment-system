<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('patient_doctor_bookmarks', function (Blueprint $table) {
        $table->id();
        $table->foreignId('patient_id')->constrained('users');
        $table->foreignId('doctor_id')->constrained('users');
        $table->timestamps();
        
        $table->unique(['patient_id', 'doctor_id']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_doctor_bookmarks');
    }
};
