export { };

declare global {
    interface IBackendRes<T> {
        error?: string | Array<string>;
        message: string;
        success: boolean;
        data?: T;
    }

    interface IProfile {
        name: string,
        id: string,
        username: string,
        email: string,
        styles: Array<string>,
        address: string,
        age: number,
        avatar: string,
    }
}