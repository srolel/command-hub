import * as React from 'react';
import { observer } from 'mobx-react';
import Store, { Command, CommandsListMode } from '../store';
import * as styles from './style.css';

export const store = new Store();

export const __reload = (deletedModule: { store: Store }) => {
    store.copyStateFrom(deletedModule.store);
};

const command = store.addCommand();
command.cwd = 'C:/repos/active-allocator/client';
command.cmd = 'npm start';

interface Props {
    store: Store,
    styles: typeof styles
}

@observer
class Component extends React.Component<Props, any> {

    refs: {
        console: Element;
    }

    renderCommandEdit = (command: Command) => {
        return <div className={styles.command}>
            <label className={styles.cwd}>
                Cwd:
                <input
                    value={command.cwd}
                    onChange={e =>
                        command.edit({ cwd: e.target.value })} />
            </label>
            <label className={styles.cmd}>
                Cmd:
                <input
                    value={command.cmd}
                    onChange={e =>
                        command.edit({ cmd: e.target.value })} />
            </label>
            {this.renderCommandExecuteButton(command)}
        </div>;
    };

    executeCommand(command: Command) {
        const {store} = this.props;
        store.setMode(CommandsListMode.Buttons);
        command.execute();
    }

    renderCommandExecuteButton(command: Command) {
        return <button onClick={() => this.executeCommand(command)}>Run</button>;
    }

    renderCommandExecute = (command: Command) => {
        const {styles} = this.props;
        return <div className={styles.commandExec}>
            <div>
                <div>Cwd:</div><pre title={command.cwd}>{command.cwd}</pre>
                <div>Cmd:</div><pre title={command.cmd}>{command.cmd}</pre>
            </div>
            {this.renderCommandExecuteButton(command)}
        </div>;
    }

    renderCommand = (command: Command) => {
        const {store} = this.props;
        if (store.mode === CommandsListMode.Edit) {
            return this.renderCommandEdit(command);
        } else {
            return this.renderCommandExecute(command);
        }
    }

    renderCommandsList() {
        const {store, styles} = this.props;
        return <div className={styles.commandsList}>
            {store.commands.map(command =>
                <div
                    key={command.id}
                    onClick={() => store.setActiveCommand(command)}
                    className={`
                        ${styles.commandWrapper}
                        ${store.active === command ? styles.activeCommand : ''}
                    `}>
                    {this.renderCommand(command)}
                </div>
            )}
        </div>;
    }

    prettifyForConsole(data: string) {
        return data.replace(/\n/g, '<br>');
    }

    renderConsole() {
        const {active} = this.props.store;
        const {console} = this.refs;
        if (console) {
            requestAnimationFrame(() => console.scrollTop = console.scrollHeight);
        }
        return <div className={styles.console}>
            {active && active.stream.map(({data}) => {
                return <pre dangerouslySetInnerHTML={{
                    __html: this.prettifyForConsole(data)
                }} />;
            })}
        </div>;
    }

    renderModeButton() {
        const {store} = this.props;
        let text: string, action: () => void;
        if (store.mode === CommandsListMode.Edit) {
            action = () => store.setMode(CommandsListMode.Buttons);
            text = 'Finished Editing';
        } else {
            action = () => store.setMode(CommandsListMode.Edit);
            text = 'Edit Commands';
        }
        return <button
            className={styles.editCommands}
            onClick={action}>
            {text}
        </button>
    }

    render() {
        const {addCommand} = this.props.store;
        return <div className={styles.main}>
            <div className={styles.commandsListWrapper}>
                <button className={styles.addCommand} onClick={addCommand}>Add Command</button>
                {this.renderModeButton()}
                {this.renderCommandsList()}
            </div>
            <div className={styles.consoleWrapper} ref="console">
                {this.renderConsole()}
            </div>
        </div>;
    }
}

export default <Component store={store} styles={styles} />;