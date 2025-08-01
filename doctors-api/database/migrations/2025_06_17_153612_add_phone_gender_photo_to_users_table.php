<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->enum('gender', [
                'male',
                'female',
                'other',
                'prefer_not_to_say'
            ])->nullable()->after('phone');
            $table->string('photo_url')->nullable()->after('gender');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'gender', 'photo_url']);
        });
    }
};