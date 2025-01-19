
export interface ToastOptions {
    /**
     * Your Application User Model ID a.k.a. AUMID.
     *
     * Defaults to Microsoft Store (UWP) if not specified, so you can see how it works.
     * AUMIDs can be classified into 2 categories: Win32 and UWP.
     *
     *
     */
    aumid?: string,
    /**
     * The title of your notification.
     *
     * ℹ️ Since the Windows 10 Anniversary Update the default and maximum is up to 2 lines of text.
     */
    title?: string,
    /**
     * The content message of your notification. You can use "\n" to create a new line for the forthcoming text.
     *
     * ℹ️ Since the Windows 10 Anniversary Update the default and maximum is up to 4 lines (combined) for the message.
     *
     */
    message?: string,
    /**
     * Reference the source of your content. This text is always displayed at the bottom of your notification, along with your app's identity or the notification's timestamp.
     *
     * On older versions of Windows that don't support attribution text, the text will simply be displayed as another text element (assuming you don't already have the maximum of 3 text elements).
     *
     */
    attribution?: string,
    /**
     * The url or file path of the image source: .png and .jpeg are supported (48x48 pixels at 100% scaling).
     *
     * ⚠️ Remote web images over http(s) are only available when using an UWP AUMID.
     * 💡 A workaround is to download yourself the image and pass the file path instead of an url.
     *
     * There are limits on the file size of each individual image.
     * 3 MB on normal connections and 1 MB on metered connections.
     * Before Fall Creators Update, images were always limited to 200 KB.
     *
     * If an image exceeds the file size, or fails to download, or times out, or is an unvalid format the image will be dropped and the rest of the notification will be displayed.
     *
     */
    icon?: string,
    /**
     * Set this to true to "circle-crop" the above icon. Otherwise, the icon is square.
     */
    cropIcon?: boolean,
    /**
     * Display a prominently image within the toast banner and inside the notification center if there is enough room.
     * Image dimensions are 364x180 pixels at 100% scaling. If the image is too big it will be cut from the bottom.
     *
     * ℹ️ This has the same restrictions as mentionned in the icon option.
     */
    heroImg?: string,
    /**
     * A full-width inline-image that appears at the bottom of the toast and inside the notification center if there is enough room. Image will be resized to fit inside the toast.
     *
     * ℹ️ This has the same restrictions as mentionned in the icon option.
     */
    inlineImg?: string,
    /**
     * The audio source to play when the toast is shown to the user instead of the default system notification sound.
     * Unfortunately you can not use a file path with this ! You are limited to the Windows sound schema available in your system.
     */
    audio?: string,
    /**
     * Set to true to loop audio while the notification is being shown.
     */
    loopAudio?: boolean,
    /**
     * Set to true to mute the sound; false to allow the toast notification sound to play.
     */
    silent?: boolean,
    /**
     * Set to true to suppress the popup message and places the toast notification silently into the notification center.
     *
     * ℹ️ NB: Using silent: true is redundant in this case.
     */
    hide?: boolean,
    activation?: string | {
        type?: "protocol" | "background",
        launch?: string,
        pfn?: string;
    },
    button?: {
        text?: string,
        activation?: string | {
            type?: string,
            launch?: string,
            pfn?: string,
            behavior?: string,
        },
        icon?: string,
        contextMenu?: string,
        tooltip?: string,
        style?: string,
        id?: string;
    }[],
    input?: {
        id: string,
        title?: string,
        placeholder?: string,
        value?: string;
    },
    select?: {
        id: string,
        title?: string,
        items: {
            id: string,
            text: string,
            default?: boolean;
        }[];
    }[],
    progress?: {
        title?: string,
        value?: number | string,
        valueOverride?: string,
        status: string;
    },
    group?: {
        id: string,
        title: string,
        activation?: string | {
            type?: string,
            launch?: string,
            pfn?: string;
        };
    },
    uniqueID?: string,
    sequenceNumber?: number,
    time?: number,
    expiration?: number,
    scenario?: "reminder" | "alarm" | "incomingCall" | "urgent",
    longTime?: boolean,
}
