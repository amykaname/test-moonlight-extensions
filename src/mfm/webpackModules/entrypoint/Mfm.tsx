// biome-ignore lint/style/useImportType: incorrect!!
import React, { createContext, useCallback, useState } from "@moonlight-mod/wp/react";
type CSSProperties = React.CSSProperties;
type ComponentType<P = {}> = React.ComponentType<P>;

import type { MfmBold, MfmCenter, MfmCodeBlock, MfmEmojiCode, MfmFn, MfmHashtag, MfmInlineCode, MfmItalic, MfmLink, MfmMention, MfmNode, MfmPlain, MfmQuote, MfmSearch, MfmSmall, MfmStrike, MfmText, MfmUnicodeEmoji, MfmUrl } from 'mfm-js';
import { mfm } from './mfmUtil.js';
import useComputed from "./react-helpers.js";

const components = {
    MfmRenderer: MfmRenderer,
    Mfm: MfmComponent,
    MfmComponent: MfmComponent,
    bold: Bold,
    italic: Italic,
    quote: Quote,
    small: Small,
    text: Text,
    center: Center,
    emojiCode: EmojiCode,
    mention: Mention,
    plain: Plain,
    blockCode: BlockCode,
    inlineCode: Inlinecode,
    search: Search,
    strike: Strike,
    unicodeEmoji: UnicodeEmoji,
    url: Url,
    link: Link,
    hashtag: Hashtag,
    fn: Fn,
    fg: Fg,
    bg: Bg,
    font: Font,
    blur: Blur,
    flip: Flip,
    scale: Scale,
    position: Position,
    x2: X2,
    x3: X3,
    x4: X4,
    jump: Jump,
    tada: Tada,
    jelly: Jelly,
    spin: Spin,
    twitch: Twitch,
    shake: Shake,
    bounce: Bounce,
    rainbow: Rainbow,
    ruby: Ruby,
    rotate: Rotate,

    sparkle: PlaceholderComponent('sparkle'),
    border: PlaceholderComponent('border'),

    mathBlock: PlaceholderComponent('mathBlock'),
    mathInline: PlaceholderComponent('mathInline'),
};

function PlaceholderComponent(name: string) {
    return () => <span style={{border: 'solid 1px red'}}>MFM component or function not implemented: {name}</span>;
}

function getComponent<K extends keyof typeof components>(string: K): typeof components[K] {
    return components[
        string.replace(/(^.)(.*)/, (_$1, $2, $3) => `${$2.toLowerCase() + $3}`) as keyof typeof components
    ] as typeof components[K];
}

type MfmProps<T> = T extends {
    props?: infer U;
    children?: infer V;
} ? {
    token: U,
    children: V,
    className?: string,
    style?: CSSProperties,
} : never;

function BlockCode(props: MfmProps<MfmCodeBlock>) {
    return <>
        { props.token.lang }
        <pre className="block-code">
        <code>{ props.token.code }</code>
        </pre>
    </>;
}

function Bold(props: MfmProps<MfmBold>) {
    return <b className="bold"><MfmComponent tokens={props.children} /></b> 
}

function Center(props: MfmProps<MfmCenter>) {
    return <>
        <div className="center">
            <MfmComponent tokens={props.children} />
        </div>
    </>;
}

const Emojis = createContext<Record<string, any>>({});
function EmojiCode(props: MfmProps<MfmEmojiCode>) {
    return <>
        <Emojis.Consumer>
            {emojis => emojis[props.token.name]
                ? <img src={emojis[props.token.name].url} alt={props.token.name} className="emoji" /> // todo better alt text
                : <span>:{ props.token.name }:</span>}
        </Emojis.Consumer>
    </>;
}

function Fn(props: MfmProps<MfmFn>) {
    const Comp = getComponent(props.token.name as keyof typeof components) as ComponentType<{
        style?: CSSProperties;
        className?: string;
        token: object;
        children: object;
    }>;
    return <>
        <Comp className={`Fn ${props.token.name} ${props.className ?? ''}`} token={props.token} style={props.style}>{props.children}</Comp>
    </>
}

function Hashtag(props: MfmProps<MfmHashtag>) {
    // return <a class="hashtag" href={`/tags/${props.token.hashtag}`}>#{ props.token.hashtag }</a>;

    return Text({ token: { text: `#${props.token.hashtag}` }, plain: true, className: props.className, style: props.style, children: props.children });
}

function Inlinecode(props: MfmProps<MfmInlineCode>) {
    return <pre className="inline-code">{ props.token.code }</pre>;
}

function Italic(props: MfmProps<MfmItalic>) {
    return <i className="italic"><MfmComponent tokens={props.children} /></i>;
}

function Link(props: MfmProps<MfmLink>) {
    return <>
        {/* <span v-if="debugMode">silent - {{ token.silent }}</span> */}
        <a className={`link ${props.className ?? ''}`} href={props.token.url} style={props.style}>
            <MfmComponent tokens={props.children} />
        </a>
    </>
}

function Mention(props: MfmProps<MfmMention>) {
    return Text({ token: { text: props.token.acct }, plain: true, className: props.className, style: props.style, children: props.children });
}

function Plain(props: MfmProps<MfmPlain>) {
    return <MfmComponent tokens={props.children} />
}

function Quote(props: MfmProps<MfmQuote>) {
    return (
        <div
            className="quote"
            style={{
                display: 'block',
                margin: '8px',
                padding: '6px 0px 6px 12px',
                color: 'var(--fg)',
                borderLeft: 'solid 3px var(--fg)',
                opacity: 0.7
            }}>
            <MfmComponent tokens={props.children} />
        </div>
    );
}

function Search(props: MfmProps<MfmSearch>) {
    const [value, setValue] = useState(props.token.query);

    return (
        <div className="search">
            <input
                type="text"
                value={value}
                onChange={(event) => {
                    setValue(event.currentTarget.value);
                }}
            />
            <button type="submit" onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                window.open(
                    `https://www.google.com/search?q=${encodeURIComponent(value.value)}`,
                    '_blank'
                );
            }}>
                検索
            </button>
        </div>
    );
}

function Small(props: MfmProps<MfmSmall>) {
    return <small className="small" style={{opacity: 0.7}}><MfmComponent tokens={props.children} /></small>;
}

function Strike(props: MfmProps<MfmStrike>) {
    return <del className="strike"><MfmComponent tokens={props.children} /></del>;
}

function Text(props: MfmProps<MfmText> & { plain: boolean }) {
    const parsedText = useComputed(useCallback(() => {
        if (!props.plain) return props.token.text.split(/\r\n|\n|\r/)
        return [props.token.text.replace(/\n/g, ' ')]
    }, [props]));

    function showBr(_text: string, index: number) {
        // 行末では改行しない
        if (index + 1 === parsedText.length) {
          return false
        }
  
        return true
    }

    return parsedText.map((t, i) => (<>
        <span class={`text ${props.className ?? ''}`} style={props.style}> { t }</span>
        {showBr(t, i) ? <br /> : <></>}
    </>));
}

function UnicodeEmoji(props: MfmProps<MfmUnicodeEmoji>) {
    return <span style={props.style}>{ props.token.emoji }</span>;
}

function Url(props: MfmProps<MfmUrl>) {
    return <a className="url" href={props.token.url} style={props.style}>{ props.token.url }</a>;
}

function Bg(props: MfmProps<MfmFn>) {
    return <MfmComponent
        className={`bg ${props.className ?? ''}`}
        tokens={props.children}
        style={{
            background: `#${props.token.args.color}`,
            ...props.style
        }}
    />
}

function Blur(props: MfmProps<MfmFn>) {
    return <>
        <MfmComponent
            className={`blur ${props.className ?? ''}`}
            tokens={props.children}
            style={{
                fontFamily: Object.keys(props.token.args).join(', '),
                ...props.style
            }}
        />
    </>;
}

function Bounce(props: MfmProps<MfmFn>) {
    return <MfmComponent
        className={`rotate ${props.className ?? ''}`}
        tokens={props.children}
        style={{
            animation: `${props.token.args.speed ?? '0.75s'} linear 0s infinite normal none running mfm-bounce`,
            transformOrigin: 'center bottom',
            ...props.style
        }}
    />;
}

function Fg(props: MfmProps<MfmFn>) {
    return <MfmComponent
        className={`fg ${props.className ?? ''}`}
        tokens={props.children}
        style={{
            color: `#${props.token.args.color}`,
            ...props.style
        }}
    />;
}

function Flip(props: MfmProps<MfmFn>) {
    return <MfmComponent
        className={`flip ${props.className ?? ''}`}
        tokens={props.children}
        style={{
            transform: `scale(${props.token.args.h ? 1 : -1}, ${props.token.args.v ? -1 : 1})`,
            ...props.style
        }}
    />;
}

function Font(props: MfmProps<MfmFn>) {
    return <MfmComponent
        className={`fg ${props.className ?? ''}`}
        tokens={props.children}
        style={{
            fontFamily: Object.keys(props.token.args).join(', '),
            ...props.style
        }}
    />;
}

function Jelly(props: MfmProps<MfmFn>) {
    return <MfmComponent
        className={`rotate ${props.className ?? ''}`}
        tokens={props.children}
        style={{
            animation: `${props.token.args.speed ?? '1s'} linear 0s infinite normal both running mfm-rubberBand`,
            ...props.style
        }}
    />;
}

function Jump(props: MfmProps<MfmFn>) {
    return <MfmComponent
        className={`position ${props.className ?? ''}`}
        tokens={props.children}
        style={{
            animation: `${props.token.args.speed ?? '0.75s'} linear 0s infinite normal none running mfm-jump`,
            ...props.style
        }}
    />;
}

function Position(props: MfmProps<MfmFn>) {
    return <MfmComponent
        className={`position ${props.className ?? ''}`}
        tokens={props.children}
        style={{
            transform: `translateX(${props.token.args.x}em) translateY(${props.token.args.y}em)`,
            ...props.style
        }}
    />;
}

function Rainbow(props: MfmProps<MfmFn>) {
    return <MfmComponent
        className={`rotate ${props.className ?? ''}`}
        tokens={props.children}
        style={{
            animation: `${props.token.args.speed ?? '0.5s'} ease 0s infinite normal none running mfm-rainbow`,
            ...props.style
        }}
    />;
}

function Rotate(props: MfmProps<MfmFn>) {
    return <MfmComponent
        className={`rotate ${props.className ?? ''}`}
        tokens={props.children}
        style={{
            transform: `rotate(${props.token.args.deg ?? 90}deg)`,
            ...props.style
        }}
    />;
}

function Ruby(props: MfmProps<MfmFn>) {
    const ruby = useComputed(useCallback(() => props.children?.[0]?.props?.text?.split(' ') ?? '', [props]));
    return <>
        <ruby>
            {ruby?.[0]}
            <rt>{ruby?.[1]}</rt>
        </ruby>
    </>;
}

function Scale(props: MfmProps<MfmFn>) {
    return <MfmComponent
        className={`rotate ${props.className ?? ''}`}
        tokens={props.children}
        style={{
            transform: `scale(${props.token.args.x}, ${props.token.args.y})`,
            ...props.style
        }}
    />;
}

function Shake(props: MfmProps<MfmFn>) {
    return <MfmComponent
        className={`position ${props.className ?? ''}`}
        tokens={props.children}
        style={{
            animation: `${props.token.args.speed ?? '0.5s'} ease 0s infinite normal none running mfm-shake`,
            ...props.style
        }}
    />
}

function Spin(props: MfmProps<MfmFn>) {
    return <MfmComponent
        className={`position ${props.className ?? ''}`}
        tokens={props.children}
        style={{
            animation: `${props.token.args.speed ?? '1.5s'} linear 0s infinite normal none running mfm-spin`,
            ...props.style
        }}
    />
}

function Tada(props: MfmProps<MfmFn>) {
    return <MfmComponent
        className={`rotate ${props.className ?? ''}`}
        tokens={props.children}
        style={{
            animation: `${props.token.args.speed ?? '1s'} linear 0s infinite normal both running tada`,
            ...props.style
        }}
    />
}

function Twitch(props: MfmProps<MfmFn>) {
    return <MfmComponent
        className={`rotate ${props.className ?? ''}`}
        tokens={props.children}
        style={{
            animation: `${props.token.args.speed ?? '1s'} linear 0s infinite normal none running mfm-twitch`,
            ...props.style
        }}
    />
}

function X2(props: MfmProps<MfmFn>) {
    return <MfmComponent
        className={`rotate ${props.className ?? ''}`}
        tokens={props.children}
        style={{
            fontSize: '200%',
            ...props.style
        }}
    />
}

function X3(props: MfmProps<MfmFn>) {
    return <MfmComponent
        className={`rotate ${props.className ?? ''}`}
        tokens={props.children}
        style={{
            fontSize: '300%',
            ...props.style
        }}
    />
}

function X4(props: MfmProps<MfmFn>) {
    return <MfmComponent
        className={`rotate ${props.className ?? ''}`}
        tokens={props.children}
        style={{
            fontSize: '400%',
            ...props.style
        }}
    />
}

function MfmComponent(props: { tokens: MfmNode[], className?: string, class?: string, style?: CSSProperties }) {
    return <>
        {props.tokens.map(token => {
            const Comp = getComponent(token.type) as ComponentType<{
                style?: CSSProperties;
                className?: string;
                token: typeof token['props'];
                children: typeof token['children'];
            }>;
            return (
                // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
                <Comp style={props.style} className={props.className ?? ''} token={token.props}>{token.children}</Comp>
            );
        })}

        {/* <div style="border: solid 1px red" v-if="debugMode">
            {props.tokens.map((token, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <div key={i}>
                    <p>Selected: { getComponent(token.type) }</p>
                    <pre>{ token }</pre>
                </div>
            ))}
        </div> */}
    </>
}

export function MfmRenderer(props: { text: string }) {
    const tokens = useComputed(useCallback(() => mfm(props.text, false), [props]));

    return <>
        <MfmComponent tokens={tokens} />
        {/* <pre>{JSON.stringify(tokens.value, null, 2)}</pre> */}
    </>;
}

