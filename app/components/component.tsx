import * as React from 'react';
import { observer } from 'mobx-react';
import Store, { Command, CommandsListMode } from '../store';
import * as styles from './style.css';

const global = window as any;
export const store = new Store();


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

    onEditSubmit: React.FormEventHandler = e => {
        e.preventDefault();
        this.setDisplayMode();
    };

    executeCommand(command: Command) {
        const {store} = this.props;
        store.setMode(CommandsListMode.Buttons);
        command.execute();
    }

    killCommand(command: Command) {
        command.kill();
        this.clearConsole(command);
    }

    clearConsole(command: Command) {
        command.clearStream();
    }

    renderCommandControls(command: Command) {
        const {store} = this.props;
        return <div>
            <button onClick={() => this.executeCommand(command)}>Run</button>
            <button onClick={() => this.killCommand(command)}>Kill</button>
            <button onClick={() => this.clearConsole(command)}>Clear</button>
            {this.renderModeButton()}
        </div>;
    }

    renderCommandField = (value: string, onChange: (value: string) => any) => {
        const {store} = this.props;
        if (store.mode === CommandsListMode.Edit) {
            return <input
                value={value}
                onChange={e => onChange((e.target as HTMLInputElement).value)} />;
        } else {
            return <pre
                onClick={this.setEditMode}
                title={value}>{value}</pre>
        }
    }

    renderActiveCommandMenu = (command?: Command) => {
        if (!command) return null;
        return <div className={`${styles.command}`}>
            <form className={styles.commandEditForm} onSubmit={this.onEditSubmit}>
                <label className={styles.name}>
                    Name:
                    {this.renderCommandField(command.name, name => command.edit({ name }))}
                </label>
                <label className={styles.cwd}>
                    Cwd:
                    {this.renderCommandField(command.cwd, cwd => command.edit({ cwd }))}
                </label>
                <label className={styles.cmd}>
                    Cmd:
                    {this.renderCommandField(command.cmd, cmd => command.edit({ cmd }))}
                </label>
                <button></button>
            </form>
            {this.renderCommandControls(command)}
        </div>;
    };

    renderCommandListItem = (command: Command) => {
        const {store, styles} = this.props;
        return <div className={`${styles.commandListItem}`}>
            <button onClick={() => store.setActiveCommand(command)}>{command.name}</button>
        </div>;
    };

    getClassForCommand(command: Command) {
        const {store, styles} = this.props;
        let classNames: string[] = [];
        if (store.active === command) {
            classNames.push(styles.activeCommand);
        }
        if (command.isRunning) {
            console.log('wat')
            classNames.push(styles.runningCommand);
        }

        if (command.hasErrors) {
            classNames.push(styles.commandWithErrors);
        }

        return classNames.join(' ');
    }

    renderCommandsList() {
        const {store, styles} = this.props;
        return <div className={styles.commandsList}>
            {store.commands.map((command, i) =>
                <div
                    key={command.id || i}
                    onClick={() => store.setActiveCommand(command)}
                    className={`${styles.commandWrapper} ${this.getClassForCommand(command)}`}>
                    {this.renderCommandListItem(command)}
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
            {active && active.stream.map(({data}, i) => {
                return <pre key={i} dangerouslySetInnerHTML={{
                    __html: this.prettifyForConsole(data)
                }} />;
            })}
        </div>;
    }

    setEditMode = () => store.setMode(CommandsListMode.Edit);
    setDisplayMode = () => store.setMode(CommandsListMode.Buttons);

    renderModeButton() {
        const {store} = this.props;
        let text: string, action: () => void;
        if (store.mode === CommandsListMode.Edit) {
            action = this.setDisplayMode;
            text = 'Finished Editing';
        } else {
            action = this.setEditMode;
            text = 'Edit Commands';
        }
        return <button
            className={styles.editCommands}
            onClick={action}>
            {text}
        </button>
    }

    renderActiveCommand() {
        const {active} = this.props.store;
        if (!active) return null;
        return <div className={styles.activeCommandContainer}>
            <div className={`${styles.activeCommandMenu} ${this.getClassForCommand(command)}`}>
                {this.renderActiveCommandMenu(active)}
            </div>
            <div className={styles.consoleWrapper} ref="console">
                {this.renderConsole()}
            </div>
        </div>;
    }

    render() {
        const {active, addCommand} = this.props.store;
        return <div className={styles.main}>
            <div className={styles.commandsListWrapper}>
                <button className={styles.addCommand} onClick={addCommand}>Add Command</button>
                {this.renderModeButton()}
                {this.renderCommandsList()}
            </div>
            {this.renderActiveCommand()}
        </div>;
    }
}

export default <Component store={store} styles={styles} />;