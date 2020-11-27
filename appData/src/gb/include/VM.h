#ifndef VM_H
#define VM_H

#include "BankData.h"

typedef struct actor_t {
    UINT8 x, y;
} actor_t;

typedef struct trigger_t {
    UINT8 x, y, width, height;
    far_ptr_t script;
} trigger_t;

typedef struct scene_t {
    UINT8 width, height;
    far_ptr_t background, collisions, colors, palette, init;
    UINT8 type, n_actors, n_triggers;
    far_ptr_t actors;
    far_ptr_t triggers;
} scene_t;

typedef struct background_t {
    UINT8 width, height;
    far_ptr_t tileset;
    UINT8 tiles[];
} background_t;

typedef struct tileset_t {
    UINT8 n_tiles;
    UINT8 tiles[];
} tileset_t;

typedef struct spritesheet_t {
    UINT8 n_frames;
    UINT8 frames[];
} spritesheet_t;

#endif