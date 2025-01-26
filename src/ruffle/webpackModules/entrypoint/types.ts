export interface Props {
    item:      Item;
    message:   Message;
    className: string;
    url:       string;
    fileName:  string;
    fileSize:  number;
}

export interface Item {
    uniqueId:     string;
    originalItem: OriginalItem;
    type:         string;
    downloadUrl:  string;
    spoiler:      boolean;
    contentType:  string;
}

export interface OriginalItem {
    id:                   string;
    filename:             string;
    size:                 number;
    url:                  string;
    proxy_url:            string;
    content_type:         string;
    content_scan_version: number;
    spoiler:              boolean;
}

export interface Message {
    type:                 number;
    content:              string;
    attachments:          OriginalItem[];
    embeds:               any[];
    timestamp:            Date;
    editedTimestamp:      null;
    flags:                number;
    components:           any[];
    codedLinks:           any[];
    stickers:             any[];
    stickerItems:         any[];
    id:                   string;
    channel_id:           string;
    author:               Author;
    bot:                  boolean;
    pinned:               boolean;
    mentions:             any[];
    mentionRoles:         any[];
    mentionChannels:      any[];
    mentionEveryone:      boolean;
    mentioned:            boolean;
    tts:                  boolean;
    giftCodes:            any[];
    state:                string;
    nonce:                null;
    blocked:              boolean;
    ignored:              boolean;
    call:                 null;
    webhookId:            null;
    reactions:            any[];
    applicationId:        null;
    application:          null;
    activity:             null;
    activityInstance:     null;
    interaction:          null;
    interactionData:      null;
    interactionMetadata:  null;
    interactionError:     null;
    messageReference:     null;
    isSearchHit:          boolean;
    loggingName:          null;
    referralTrialOfferId: null;
    giftingPrompt:        null;
    messageSnapshots:     any[];
    isUnsupported:        boolean;
    changelogId:          null;
}

export interface Author {
    id:                   string;
    username:             string;
    discriminator:        string;
    avatar:               string;
    avatarDecorationData: null;
    banner:               null;
    email:                string;
    verified:             boolean;
    bot:                  boolean;
    system:               boolean;
    mfaEnabled:           boolean;
    mobile:               boolean;
    desktop:              boolean;
    premiumType:          null;
    flags:                number;
    publicFlags:          number;
    purchasedFlags:       number;
    premiumUsageFlags:    number;
    phone:                string;
    nsfwAllowed:          boolean;
    guildMemberAvatars:   GuildMemberAvatars;
    hasBouncedEmail:      boolean;
    personalConnectionId: null;
    globalName:           string;
    primaryGuild:         null;
}

export interface GuildMemberAvatars {
}
