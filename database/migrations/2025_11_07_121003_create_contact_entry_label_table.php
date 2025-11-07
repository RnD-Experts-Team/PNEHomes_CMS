<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('contact_entry_label', function (Blueprint $table) {
            $table->unsignedBigInteger('contact_entry_id');
            $table->unsignedBigInteger('label_id');
            $table->primary(['contact_entry_id', 'label_id']);
            $table->foreign('contact_entry_id')->references('id')->on('contact_entries')->onDelete('cascade');
            $table->foreign('label_id')->references('id')->on('labels')->onDelete('cascade');
        });
    }

    public function down(): void {
        Schema::dropIfExists('contact_entry_label');
    }
};
