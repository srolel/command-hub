declare module 'killprocess' {
    export default function terminate(pid: number, signal?: string | null, callback?: Function): void;
}