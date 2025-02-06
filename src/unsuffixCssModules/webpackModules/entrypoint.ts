import React from "@moonlight-mod/wp/react";

const logger = moonlight.getLogger("unsuffixCssModules/entrypoint");
const cache = new Map<string, { discordClass: string; moduleId: string; }>();

function getDiscordClassAndModuleId(className: string): { discordClass: string; moduleId: string; } {
    const cached = cache.get(className);
    if (cached) {
        return cached;
    }

    const result = {
        discordClass: className
            .replace(/\b(\w+)_[a-zA-Z0-9_\-]{6}\b/g, '$1'),

        moduleId: className
            .match(/\b\w+_([a-zA-Z0-9_\-]{6})\b/g)
            ?.map(e => e.slice(e.indexOf('_') + 1))
            .filter((e, idx, arr) => arr.indexOf(e) === idx) // deduplicate
            .join(' ')
            ?? '',
    };

    cache.set(className, result);
    return result;
}

const createElementOrig = React.createElement.bind(React);
React.createElement = (...args: any[]) => {
    const props = args[1] as React.InputHTMLAttributes<HTMLInputElement> & React.ClassAttributes<HTMLInputElement> | null;
    if (props?.className) {
        const { discordClass, moduleId } = getDiscordClassAndModuleId(props.className);

        (props as any)['data-discord-class'] = discordClass;
        (props as any)['data-discord-module-id'] = moduleId;
    }

    // @ts-expect-error intentional
    return createElementOrig(...args) as any;
};

export function jsx(origJsx: any, args: any[]) {
    const props = args[1] as React.InputHTMLAttributes<HTMLInputElement> & React.ClassAttributes<HTMLInputElement> | null;
    if (props?.className) {
        const { discordClass, moduleId } = getDiscordClassAndModuleId(props.className);

        (props as any)['data-discord-class'] = discordClass;
        (props as any)['data-discord-module-id'] = moduleId;
    }

    // console.log('jsx', ...args);

    return origJsx(...args);
}

// this is for appMount only
const classNameDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'className');
Object.defineProperty(Element.prototype, 'className', {
    get(this: Element) {
        return classNameDescriptor!.get!.call(this);
    },
    set(this: Element, value: string) {
        const { discordClass, moduleId } = getDiscordClassAndModuleId(value);

        this.setAttribute('data-discord-class', discordClass);
        this.setAttribute('data-discord-module-id', moduleId);

        classNameDescriptor!.set!.call(this, value);
    }
});