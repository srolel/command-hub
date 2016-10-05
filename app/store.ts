import { spawn, ChildProcess } from 'child_process';
import { toJS, observable, computed, action, autorun } from 'mobx';

export enum CommandStreamType { Log, Error, Warning };

interface CommandStream {
    data: string;
    type: CommandStreamType;
}

interface EditableCommandFields {
    id?: number;
    cwd?: string;
    cmd?: string;
    args?: string[];
}

export class Command implements EditableCommandFields {

    constructor(id: number) {
        this.id = id;
    }

    @observable id: number;
    @observable cwd: string = '';
    @observable cmd: string = '';
    @observable args: string[] = [];
    @observable stream: CommandStream[] = [];

    @computed private get computedArgs() {
        const argsFromCmd = this.cmd.split(' ').slice(1);
        // concat doesn't work here since this.args isn't an array,
        // it's a mobx ObservableArray. But it's iterable
        argsFromCmd.push(...this.args);
        return argsFromCmd;
    }

    @computed private get computedCmd() {
        return this.cmd.split(' ').shift();
    }

    @computed private get cmdWithArgs() {
        return {
            cmd: `cd ${this.cwd} && ${this.computedCmd}`,
            args: this.computedArgs
        };
    }

    @computed get errors() {
        return this.stream.filter(s => s.type === CommandStreamType.Error);
    }

    @computed get hasErrors() {
        return this.errors.length > 0;
    }

    spawned: ChildProcess;

    @action edit(edited: EditableCommandFields) {
        if (edited.cwd)
            this.cwd = edited.cwd;

        if (edited.cmd)
            this.cmd = edited.cmd;

        if (edited.args)
            this.args = edited.args;
    }

    @action addToStream(stream: CommandStream) {
        this.stream.push(stream);
    }

    kill() {
        this.spawned.kill();
    }

    spawn = () => {
        const {cmd, args} = this.cmdWithArgs;
        this.spawned = spawn(cmd, args, { shell: true });

        this.spawned.stdout.on('data', data => {
            this.addToStream({ data: String(data), type: CommandStreamType.Log })
        });

        this.spawned.stderr.on('data', data => {
            this.addToStream({ data: String(data), type: CommandStreamType.Error })
        });
    }

    execute = this.spawn;
}

export enum CommandsListMode { Buttons, Edit };

class SerializableStore {
    mode: any;
    active: any;
    commands: EditableCommandFields[];
}

class Store {

    idCounter = 0;

    constructor(store?: Store) {
        if (store)
            this.copyStateFrom(store)
    }

    @observable mode = CommandsListMode.Edit;

    @observable active: Command;
    @observable commands: Command[] = [];
    @action addCommand = () => {
        const command = new Command(this.idCounter++);
        this.commands.push(command);
        return command;
    };
    @action setActiveCommand = (command: Command) => {
        this.active = command;
    };
    @action setMode = (mode: CommandsListMode) => {
        this.mode = mode;
    }

    /*
    * for hot reload
    */
    @action
    copyStateFrom(store: Store) {
        console.log(store.commands);
        this.mode = store.mode;
        this.active = store.active;
        this.commands = store.commands;
    }
}

export default Store;