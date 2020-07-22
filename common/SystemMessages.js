'use strict'

/*
On lite-user / card receiver submitting chat form and user has an available chat slot (normal behavior)

to user from system number: "CardDate: {liteuser} wants to chat with you. This is how {liteuser} says you met: {howmet}. Do you want to accept the chat with {liteuser}? Respond with 'yes' or 'no'"

to liteuser from system number: "CardDate: We've sent your chat request to {user} for approval. As soon as {user} approves the chat, we will text you."
*/
exports.StartConversation_Normal_LightUser = firstName => `CardDate: We've sent your chat request to ${firstName} for approval. As soon as ${firstName} approves the chat, we will text you.`;
exports.StartConversation_Normal_CardUser = (firstName, howWeMetMessage) => `CardDate: ${firstName} wants to chat with you. This is how ${firstName} says you met: ${howWeMetMessage}. Do you want to accept the chat with ${firstName}? Respond with 'yes' or 'no'`;

/*
On lite-user / receiver sending /end or /block before the chat is accepted:

to {user} from system number: "CardDate: {liteuser} ended the chat before you could accept it. You can no longer start the chat."

to {liteuser} from system number: "CardDate: Chat ended. You won't receive any more texts from us.
*/
exports.EndChatBeforeAccepted_LightUser = () => `CardDate: Chat ended. You won't receive any more texts from us.`;
exports.EndChatBeforeAccepted_CardUser = (firstName) =>`CardDate: ${firstName} ended the chat before you could accept it. You can no longer start the chat.`;

/*
On lite-user / card receiver submitting chat form and user is out of chat slots

to user from system number: "CardDate: {liteuser} wants to chat with you. This is how {liteuser} says you met: {howmet}

to user from system number: "CardDate: You are out of available chat slots. Please end one of your current chats to start a chat with {liteuser}."
*/
exports.StartConversation_OutOfConversations_LightUser = firstName => `CardDate: We've sent your chat request to ${firstName} for approval. As soon as ${firstName} approves the chat, we will text you.`;
exports.StartConversation_OutOfConversations_CardUser = (firstName, howWeMetMessage) => [
	`CardDate: ${firstName} wants to chat with you. This is how ${firstName} says you met: ${howWeMetMessage}`,
	`CardDate: You are out of available chat slots. Please end one of your current chats to start a chat with ${firstName}.`
];

/*
On reply of yes or y (not case sensitive) to chat prompt to user:

to user from system number: "CardDate: We are starting the chat between you and {liteuser} on a masked number. Please wait for the welcome message you should get in a few seconds."

to user from masked number: "CardDate: You are now chatting with {liteuser}. Your real phone number is being hidden and is never shown to {liteuser}. Type /help to get a list of commands or /end to end the chat."

to liteuser from masked number: "CardDate: {User} accepted your chat request and you are now chatting.  Your real phone number is being hidden and is never shown to {user}. Type /help to get a list of commands or /end to end the chat."
*/
exports.AcceptConversation_LightUser = (firstName) => `CardDate: ${firstName} accepted your chat request and you are now chatting.  Your real phone number is being hidden and is never shown to ${firstName}. Type /help to get a list of commands or /end to end the chat.`;
exports.AcceptConversation_CardUser = (firstName) => [
	`CardDate: We are starting the chat between you and ${firstName} on a masked number. Please wait for the welcome message you should get in a few seconds.`,
	`CardDate: You are now chatting with ${firstName}. Your real phone number is being hidden and is never shown to ${firstName}. Type /help to get a list of commands or /end to end the chat.`
];

/*
On reply to phone number connected to a conversation that is no longer active:

to whomever sent it from system number (only once): "CardDate: Your chat with {user/liteuser} as ended and you can no longer communicate. Further text messages you send will not be delivered."
*/
exports.EndedConversation_AnyUser = (firstName) => `CardDate: Your chat with ${firstName} as ended and you can no longer communicate. Further text messages you send will not be delivered.`;

/*
On command of /help:

to whomever sent it (using masked number OR system number): "CardDate: To end an active chat, send /end. To end a chat and also stop a person from attempting to contact you again, send /block. You can find more controls and options by going to https://card.date/"
*/
exports.Command_Help_AnyUser = () => `CardDate: To end an active chat, send /end. To end a chat and also stop a person from attempting to contact you again, send /block. You can find more controls and options by going to https://card.date/`;
 
/*
On command of /end:

to user from masked number: "CardDate: Your chat with {liteuser} was manually ended and no more messages will go through."

to liteuser from masked number: "CardDate: Your chat with {user} was manually ended and no more messages will go through. You won't receive any more texts from us."
*/
exports.Command_End_LightUser = (firstName) => `CardDate: Your chat with ${firstName} was manually ended and no more messages will go through.`;
exports.Command_End_CardUser = (firstName) => `CardDate: Your chat with ${firstName} was manually ended and no more messages will go through. You won't receive any more texts from us.`;

/*
After 48 hours of no user - user messages:

to user from masked number: "CardDate: Your chat with {liteuser} is about to expire due to lack of activity. To keep it open, send a message!"

to liteuser from masked number: "CardDate: Your chat with {user} is about to expire due to lack of activity. To keep it open, send a message!"
*/
exports.IdleConversation_Warning_LightUser = (firstName) => `CardDate: Your chat with ${firstName} is about to expire due to lack of activity. To keep it open, send a message!`;
exports.IdleConversation_Warning_CardUser = (firstName) => `CardDate: Your chat with ${firstName} is about to expire due to lack of activity. To keep it open, send a message!`;

/*
On72 hours going by without a message between the two:

to user from masked number: "CardDate: Your chat with {liteuser} was automatically ended due to inactivity and no more messages will go through."

to liteuser from masked number: "CardDate: Your chat with {user} was automatically ended due to inactivity and no more messages will go through. You won't receive any more texts from us."
*/
exports.IdleConversation_Terminate_LightUser = (firstName) => `CardDate: Your chat with ${firstName} was automatically ended due to inactivity and no more messages will go through. You won't receive any more texts from us.`;
exports.IdleConversation_Terminate_CardUser = (firstName) => `CardDate: Your chat with ${firstName} was automatically ended due to inactivity and no more messages will go through.`;

/*
On command of /block while the conversation is still active:

to {blocker} from masked number: "CardDate: Your chat with {blockeduser} was manually ended and no more messages will go through. Are you sure you would like to block {blockeduser}? Reply with 'yes' or 'no'."

to {blockeduser} from masked number: "CardDate: Your chat with {user} was manually ended and no more messages will go through."
*/
exports.Command_Block_Blocker = (firstName) => `CardDate: Your chat with ${firstName} was manually ended and no more messages will go through. Are you sure you would like to block ${firstName}? Reply with 'yes' or 'no'.`;
exports.Command_Block_Blockee = (firstName) => `CardDate: Your chat with ${firstName} was manually ended and no more messages will go through.`;

/*
On reply y or yes after system sent /block confirmation message (within 1 hour; after this period, the system should respond as though the conversation is simply ended and will no longer accept confirmation for a block):

to {blocker} from masked number: "CardDate: You have blocked {blockeduser} and will no longer receive any messages or requests from them."
*/
exports.Command_Block_Confirm = (firstName) => `CardDate: You have blocked ${firstName} and will no longer receive any messages or requests from them.`;

/*
On reply n or no after system sent /block confirmation message (within 1 hour; same as yes confirmation message limit):

to {blocker} from masked number: "CardDate: {blockeduser} was not blocked."
*/
exports.Command_Block_Abort = (firstName) => `CardDate: ${firstName} was not blocked.`;

/*
Once user's SMS pool reaches 20 remaining or lower (only once):

to {user} from system number: "CardDate: You have {smsCount} messages remaining for this billing period. Visit your [account page](https://dashboard.card.date/) to upgrade your plan."
*/
exports.MessageAllowance_Warning = (messageAllowance) => `CardDate: You have ${messageAllowance} messages remaining for this billing period. Visit your [account page](https://dashboard.card.date/) to upgrade your plan.`;


/*
User is out of SMS in their pool:

to {user} from system number: "CardDate: You are out of messages for this billing period and will no longer be able to send or receive any more messages. Visit your [account page](https://dashboard.card.date/) to upgrade your plan."
*/
exports.MessageAllowance_Enforce = () => `CardDate: You are out of messages for this billing period and will no longer be able to send or receive any more messages. Visit your [account page](https://dashboard.card.date/) to upgrade your plan.`;

/*
User is out of SMS in their pool and a liteuser tries to send a message (only once):

to {liteuser} from masked number: "CardDate: Your message wasn't sent because {user} is out of messages. Any following messages will not be delivered."
*/
exports.RejectMessageFromLightUserToCardUserExceedingMessageAllowance = (firstName) => `CardDate: Your message wasn't sent because ${firstName} is out of messages. Any following messages will not be delivered.`;