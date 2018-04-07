'use strict';

let type = "WebGL";


if (!PIXI.utils.isWebGLSupported()){
    type = "canvas"
}

let app = new PIXI.Application({
    width: 1000,
    height: 1000,
    antialias: true,
    resolution: 1,
    backgroundColor : 0x1099bb
});

document.body.appendChild(app.view);


let socket = io();


PIXI
    .loader
    .add(
        [
            'res/assets/img/tank.jpg',
        ]
    )
    .add(
        'tanksTile', 'res/assets/img/tank_sprites.png',
        'wallsTile', 'res/assets/img/walls.png'
    )
    .load(setup);


let Roles = {
    RIGHT_WHEEL: 'RIGHT_WHEEL',
    LEFT_WHEEL: 'LEFT_WHEEL',
    GUN: 'GUN',
    TOWER: 'TOWER',
};


function keyboard(keyCode) {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}

let KeyCodes = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
};

let Keys = {
    LEFT: keyboard(KeyCodes.LEFT),
    UP: keyboard(KeyCodes.UP),
    RIGHT: keyboard(KeyCodes.RIGHT),
    DOWN: keyboard(KeyCodes.DOWN),
};


Keys.UP.press = () => {
    socket.emit('push-button', 'up');
};

Keys.UP.release = () => {
    socket.emit('push-button', 'up');
};

Keys.DOWN.press = () => {
    socket.emit('push-button', 'down');
};

Keys.DOWN.release = () => {
    socket.emit('push-button', 'down');
};

/*
let stub_tanks = [{
        'id': 1,
        'players': [
            {'role': Roles.GUN, 'is_playing': false},
            {'role': Roles.TOWER, 'is_playing': true},
            {'role': Roles.LEFT_WHEEL, 'is_playing': true},
            {'role': Roles.RIGHT_WHEEL, 'is_playing': true},
        ],
        'position': {
            'x': 0,
            'y': 0,
        }
    }
];*/


let gui_font_style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 24,
    fill: "white",
    stroke: '#ff3300',
    strokeThickness: 4,
});

let gui_button_font_style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 24,
    fill: "white",
    stroke: '#da36ff',
    strokeThickness: 4,
});

let tank_font_style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 20,
    fill: "white",
    stroke: '#0055ff',
    strokeThickness: 4,
});

let tank_role_available_font_style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 18,
    fill: "white",
    stroke: '#559900',
    strokeThickness: 4,
});

let tank_role_unavailable_font_style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 18,
    fill: "#bbb",
    stroke: '#555',
    strokeThickness: 4,
});


function defaultAddSpritesToStage(sprites) {
    for (let i = 0; i < sprites.length; i++) {
        app.state.gui_sprites.push(sprites[i]);
        app.stage.addChild(sprites[i]);
    }
}

function defaultOnStateLeft() {
    console.log('defaultOnStateLeft');

    for (let i = 0; i < app.state.gui_sprites.length; i++) {
        console.log(app.state.gui_sprites[i].PROP);

        app.stage.removeChild(app.state.gui_sprites[i]);
    }
}

let TANK_ALL_ROLES = Object.values(Roles);

function isTankAvailable(tank) {
    for (let i = 0; i < tank.players.length; i++) {
        if (! tank.players[i].is_playing) {
            return true;
        }
    }

    return false;
}

function updateTanks(tanks) {
    // load tank sprites

    let new_playing_tanks = tanks.filter(tank => tank.players.filter(p => p.is_playing).length >= TANK_ALL_ROLES.length);
    const should_update_all_playing_tanks = app.state.playing_tanks.length !== new_playing_tanks.length;

    if (should_update_all_playing_tanks) {
        // cleanup old playing tanks sprites

        if (app.state.playing_tanks_sprites != null && app.state.playing_tanks_sprites.length > 0) {
            for (let i = 0; i < app.state.playing_tanks_sprites.length; i++) {
                app.stage.removeChild(app.state.playing_tanks_sprites[i]);
            }
        }

        // generate new playing tanks sprites & assign to corresponding tanks

        app.state.playing_tanks = new_playing_tanks;
        app.state.playing_tanks_sprites = genTanks(new_playing_tanks.length);

        for (let i = 0; i < new_playing_tanks.length; i++) {
            // Assign sprites to corresponding tanks for easier access
            let current_tank_sprite = app.state.playing_tanks_sprites[i];

            defaultAddSpritesToStage([current_tank_sprite]);

            new_playing_tanks[i].sprite = current_tank_sprite;
        }
    }

    // update positions & other dynamic data of tanks

    let updated_playing_tanks_ids = new Set();

    for (let i = 0; i < new_playing_tanks.length; i++) {
        let new_playing_tank = new_playing_tanks[i];

        for (let j = 0; j < app.state.playing_tanks.length; j++) {
            let old_playing_tank = app.state.playing_tanks[j];

            if (new_playing_tank.id === old_playing_tank.id && ! updated_playing_tanks_ids.has(new_playing_tank.id)) {
                old_playing_tank.position = new_playing_tank.position;
                // TODO update other dynamic fields

                updated_playing_tanks_ids.add(new_playing_tank.id);
            }
        }
    }

    // load & show awaiting tanks

    let new_awaiting_tanks = tanks.filter(tank => tank.players.filter(p => p.is_playing).length < TANK_ALL_ROLES.length);

    const should_update_all_awaiting_tanks = app.state.awaiting_tanks.length !== new_awaiting_tanks.length;

    if (should_update_all_awaiting_tanks) {
        // cleanup old awaiting tanks sprites

        for (let i = 0; i < app.state.awaiting_tanks.length; i++) {
            for (let j = 0; j < app.state.awaiting_tanks[i].players.length; j++) {
                if (app.state.awaiting_tanks[i].players[j].sprite != null) {
                    app.stage.removeChild(app.state.awaiting_tanks[i].players[j].sprite);
                }
            }
        }

        app.state.awaiting_tanks = new_awaiting_tanks;

        // generate new awaiting tanks players roles sprites & assign to corresponding players

        let gui_tank_offset_x = 10;
        let gui_tank_offset_y = 70;

        for (let i = 0; i < new_awaiting_tanks.length; i++) {
            let awaiting_tank = new_awaiting_tanks[i];
            let current_tank_id = awaiting_tank.id;

            let role_gui_offset_y = 30;

            let gui_elem = new PIXI.Text(awaiting_tank.id, tank_font_style);
            gui_elem.position.set(gui_tank_offset_x, gui_tank_offset_y);

            gui_elem.PROP = 'qwdwefwfw';

            defaultAddSpritesToStage([gui_elem]);

            for (let j = 0; j < awaiting_tank.players.length; j++) {
                let current_player = awaiting_tank.players[j];
                let current_role = current_player.role;
                let is_role_available = !current_player.is_playing;

                let gui_font_style = is_role_available ? tank_role_available_font_style : tank_role_unavailable_font_style;

                let gui_elem = new PIXI.Text(current_role, gui_font_style);

                let x = gui_tank_offset_x;
                let y = gui_tank_offset_y + role_gui_offset_y;
                role_gui_offset_y += 20;

                gui_elem.position.set(x, y);

                current_player.sprite = gui_elem;

                if (is_role_available) {
                    gui_elem.interactive = true;
                    gui_elem.click = function (e) {
                        app.state.tank_id = current_tank_id;
                        app.state.role = current_role;

                        socket.emit('join-tank', {
                            tankId: current_tank_id,
                            position: {
                                [Roles.GUN]: 'join-gun',
                                [Roles.TOWER]: 'join-turret',
                                [Roles.LEFT_WHEEL]: 'join-left-track',
                                [Roles.RIGHT_WHEEL]: 'join-right-track',
                            }[current_role]
                        });
                    };
                }

                defaultAddSpritesToStage([gui_elem]);
            }

            gui_tank_offset_x += 140;
        }
    }

    // update players in awaiting tanks (dynamic fields)

    let updated_awaiting_tanks_ids = new Set();

    for (let i = 0; i < new_awaiting_tanks.length; i++) {
        let new_awaiting_tank = new_awaiting_tanks[i];

        for (let j = 0; j < app.state.awaiting_tanks.length; j++) {
            let old_awaiting_tank = app.state.awaiting_tanks[j];

            if (new_awaiting_tank.id !== old_awaiting_tank.id || updated_awaiting_tanks_ids.has(new_awaiting_tank.id)) {
                continue;
            }

            const should_be_updated = new_awaiting_tank
                .players
                .filter(p => p.is_playing).length !== old_awaiting_tank.players.filter(p => p.is_playing).length;

            if (should_be_updated) {
                let updated_players_roles = new Set();

                for (let k = 0; k < new_awaiting_tank.players.length; k++) {
                    let new_awaiting_tank_player = new_awaiting_tank.players[k];

                    for (let m = 0; m < old_awaiting_tank.players.length; m++) {
                        let old_awaiting_tank_player = old_awaiting_tank.players[m];

                        if (new_awaiting_tank_player.role !== old_awaiting_tank_player.role || updated_players_roles.has(new_awaiting_tank_player.role)) {
                            continue;
                        }

                        old_awaiting_tank_player.is_playing = new_awaiting_tank_player.is_playing;

                        // TODO update other dynamic fields

                        updated_players_roles.add(new_awaiting_tank_player.role);
                    }
                }

                updated_awaiting_tanks_ids.add(new_awaiting_tank.id);
            }
        }
    }
}

function updateObstacles(new_obstacles) {
    let should_update = new_obstacles != null && new_obstacles.length === app.state.obstacles.length;

    if (!should_update) {
        return;
    }

    for (let i = 0; i < new_obstacles.length; i++) {
        let obstacle = new_obstacles[i];

        obstacle.sprite = genObstacle(obstacle.position.x, obstacle.position.y);
    }

    app.state.obstacles = new_obstacles;
}

let States = {
    REGISTRATION: {
        id: 'REGISTRATION',
        onEnter: function () {
            let current_state = new PIXI.Text('State: ' + app.state.id, gui_font_style);
            current_state.position.set(0, 0);

            defaultAddSpritesToStage([current_state]);
        },
        onLeft: function () {
            defaultOnStateLeft();
        }
    },
    TEAMING: {
        id: 'TEAMING',
        onEnter: function () {
            let player = new PIXI.Text('Player: ' + app.state.username, gui_font_style);
            player.position.set(10, 10);

            let create_tank = new PIXI.Text('Create tank', gui_button_font_style);
            create_tank.position.set(10, 40);

            create_tank.interactive = true;
            create_tank.click = function (e) {
                socket.emit('create-tank');
            };

            defaultAddSpritesToStage([player, create_tank]);
        },
        onLeft: function () {
            defaultOnStateLeft();
        }
    },
    PLAYING: {
        id: 'PLAYING',
        onEnter: function () {
            for (let i = 0; i < app.state.playing_tanks_sprites.length; i++) {
                app.stage.addChild(app.state.playing_tanks_sprites[i]);
            }

            let player = new PIXI.Text('Player: ' + app.state.username, gui_font_style);
            player.position.set(0, 0);

            defaultAddSpritesToStage([player]);
        },
        onLeft: function () {
            defaultOnStateLeft();

            for (let i = 0; i < app.state.playing_tanks_sprites.length; i++) {
                app.stage.removeChild(app.state.playing_tanks_sprites[i]);
            }
        }
    },
    RANKING: {
        id: 'RANKING',
        onEnter: function () {

        },
        onLeft: function () {

        }
    },
};

function genTank(type, pos_x, pos_y) {
    let tankRect = new PIXI.Rectangle(0, 0, 32, 32);
    let tankTexture = new PIXI.Texture(PIXI.utils.TextureCache.tanksTile, tankRect);

    tankTexture.frame = tankRect;

    let tankSprite = new PIXI.Sprite(tankTexture);

    tankSprite.tankType = type;
    tankSprite.animationFrameId = 100;

    tankSprite.animate = function () {
        let h = 32;
        let w = 32;
        let y = h * this.tankType;

        this.animationFrameId = ((this.animationFrameId + 1) % 8);
        let x = this.animationFrameId * w;

        tankTexture.frame = new PIXI.Rectangle(x, y, w, h);
    };

    // center the sprite's anchor point
    tankSprite.anchor.set(0.5);

    // move the sprite to the center of the screen
    tankSprite.x = pos_x;
    tankSprite.y = pos_y;

    return tankSprite;
}

function genObstacle(pos_x, pos_y) {
    let obstacleRect = new PIXI.Rectangle(0, 0, 32, 32);
    let obstacleTexture = new PIXI.Texture(PIXI.utils.TextureCache.wallsTile, obstacleRect);

    obstacleTexture.frame = obstacleRect;

    return new PIXI.Sprite(obstacleTexture);
}

function genTanks(count) {
    if (count == null) {
        count = 2;
    }

    let tanks = [];

    for (let i = 0; i < count; i++) {
        tanks.push(genTank(i, app.screen.width / 2 + i * 20, app.screen.height / 2 + i * 20));
    }

    return tanks;
}

function onStateChanged(old_state_id, new_state_id) {
    if (new_state_id === States.TEAMING) {
        // TODO: how many playing_tanks_sprites do we need? && load from server
        // TODO fetch tanks from server

        for (let i = 0; i < app.playing_tanks_sprites.length; i++) {
            app.stage.addChild(app.playing_tanks_sprites[i]);
        }
    }
}

function changeState(new_state_id) {
    let old_state_id = app.state.id;

    console.log(old_state_id);

    if (States[old_state_id] != null) {
        console.log('>> State left:', old_state_id);
        States[old_state_id].onLeft();
    } else {
        console.log('Error: States[old_state_id] = null');
    }

    app.state.id = new_state_id;

    if (States[new_state_id] != null) {
        console.log('>> State entered:', new_state_id);
        States[new_state_id].onEnter();
    } else {
        console.log('Error: States[new_state_id] = null');
    }

    return onStateChanged(old_state_id, new_state_id);
}

function gameLoop(delta) {
    if (app.state.id === States.TEAMING.id) {
        // refresh gui

        for (let i = 0; i < app.state.awaiting_tanks.length; i++) {
            let awaiting_tank = app.state.awaiting_tanks[i];

            for (let j = 0; j < awaiting_tank.players.length; j++) {
                let awaiting_tank_player = awaiting_tank.players[j];

                awaiting_tank_player.sprite.style = (!awaiting_tank_player.is_playing) ? tank_role_available_font_style : tank_role_unavailable_font_style;
            }
        }

        let my_tank = null;

        for (let i = 0; i < app.state.playing_tanks.length; i++) {
            let tank = app.state.playing_tanks[i];

            if (tank.id !== app.state.tank_id) {
                continue;
            }

            my_tank = app.state.playing_tanks[i];
            break;
        }

        if (my_tank != null) {
            changeState(States.PLAYING.id);
            return;
        }
    }

    if (app.state.id === States.PLAYING.id) {
        for (let i = 0; i < app.state.playing_tanks.length; i++) {
            let tank = app.state.playing_tanks[i];

            if (tank.sprite != null) {
                tank.sprite.rotation += tank.position.angle;
                tank.sprite.position.x = tank.position.x;
                tank.sprite.position.y = tank.position.y;

                tank.sprite.animate();
            }
        }
    }
}

function setup() {
    // Render GUI

    app.state = {
        id: null,
        username: null,
        gui_sprites: [],

        awaiting_tanks: [],
        playing_tanks: [],

        tank_id: null,
        role: null,

        obstacles: [],
    };

    socket.on('players', function (e) {
        console.log('players', e);
    });

    socket.on('game-state', function (data) {
        console.log(data.game);
        updateTanks(data.game.tanks);
        updateObstacles(data.game.obstacles);
        // updateBullets(data.game.bullets);
    });

    changeState(States.REGISTRATION.id);

    app.state.username = getRandomInt(100, 1000);

    changeState(States.TEAMING.id);

    app.ticker.add(gameLoop);
}
