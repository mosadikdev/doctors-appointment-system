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
    if (!Schema::hasColumn('availabilities', 'doctor_id')) {
        Schema::table('availabilities', function (Blueprint $table) {
            $table->unsignedBigInteger('doctor_id')->nullable()->after('id');
        });
    }

    if (Schema::hasColumn('availabilities', 'user_id')) {
        DB::statement('UPDATE availabilities SET doctor_id = user_id');

        Schema::table('availabilities', function (Blueprint $table) {
            try {
                $table->dropForeign(['user_id']);
            } catch (\Throwable $e) {}

            $table->dropColumn('user_id');
        });
    }
}



    public function down()
    {
        Schema::table('availabilities', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->after('id')->nullable();

            DB::statement('UPDATE availabilities SET user_id = doctor_id');

            $table->dropForeign(['doctor_id']);
            $table->dropColumn('doctor_id');

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

};
