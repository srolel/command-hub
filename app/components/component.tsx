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

    renderCommandExecuteButton(command: Command) {
        return <button onClick={() => this.executeCommand(command)}>Run</button>;
    }


    renderCommandField = (value: string, onChange: (value: string) => any) => {
        const {store} = this.props;
        if (command === store.active && store.mode === CommandsListMode.Edit) {
            return <input
                value={value}
                onChange={e =>
                    command.edit({ cwd: e.target.value })} />;
        } else {
            return <pre
                onClick={this.setEditMode}
                title={value}>{value}</pre>
        }
    }

    renderCommand = (command: Command) => {
        return <div className={styles.command}>
            <form onSubmit={this.onEditSubmit}>
                <label className={styles.cwd}>
                    Cwd:
                    {this.renderCommandField(command.cwd, cwd => command.edit({ cwd }))}
                </label>
                <label className={styles.cmd}>
                    Cmd:
                    {this.renderCommandField(command.cmd, cmd => command.edit({ cmd }))}
                </label>
                {this.renderCommandExecuteButton(command)}
            </form>
        </div>;
    };

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
                        ${command.hasErrors ? styles.commandWithErrors : ''}
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

    setEditMode = () => store.setMode(CommandsListMode.Edit);
    setDisplayMode = () => store.setMode(CommandsListMode.Buttons);

    renderModeButton() {
        const {store} = this.props;
        let text: string, action: () => void;
        if (store.mode === CommandsListMode.Edit) {
            action = this.setDisplayMode;
            text = 'Finished Editing';
        } else {
            action = this.setDisplayMode;
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