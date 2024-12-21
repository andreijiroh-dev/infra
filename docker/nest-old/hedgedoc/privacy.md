---
tags: legalese, recaptime-dev, policy, meta
breaks: false
---

# Privacy policy for `notepad.recaptime.dev`

_**Last updated**: 2024-09-20 ([commit history])_

## How your data is stored and processed

We process the following data, for the following purposes:

* **your public IP address**: used to communicate with our backend servers and only be used and stored for logging and security reasons
* **your usernames and profile info**: provides a login integration with GitHub and Slack
* **profile pictures**: either loaded from this instance, the service you used to log you in here or via Libravatar.
* **uploaded pictures**: they are not stored locally on Nest server as a courtesy to other users,
but instead stored on our Storj DCS bucket, which can be accessible at <https://cdn.lorebooks.wiki/community/notepads>

All account data and notes are stored in Nest Postgres. Besides the user accounts and the document themselves also relationships between the documents and the user accounts are stored. This includes ownership, authorship and revisions of all changes made during the creation of a note.

## Requesting data deletion

To delete your account and all your notes owned by your user account, you can find a button in the drop down menu on the front page.

The deletion of guest notes is not possible by design, unless requested as part of [a takedown request](https://forms.recaptime.dev/abuse?type=takedown-requests) or [in a data deletion request form](https://forms.recaptime.dev/gdpr-requests?type=right-to-delete&service=notepad). These don't have any ownership and this means we can't connect these to you or anyone else.
If you participated in a guest note or a note owned by someone else, your authorship for the revisions is anonymized from these notes as well.
But the content you created will stay in place as the integrity of these notes has to stay untouched.

## Additional privacy policies apply

The [Nest Privacy Policy](https://guides.hackclub.app/index.php/Nest:Privacy_policy) and [RecapTime.dev Privacy Policy](https://policies.recaptime.dev/privacy) also apply to this instance, so please consult them too for your reference.

## Privacy contact

If you have questions about this privacy policy or want to excerise your data privacy rights, please email `privacy [at] recaptime.dev` or [directly contact Andrei Jiroh] (`@ajhalili2006` in Hack Club Slack).

[commit history]: https://mau.dev/andreijiroh-dev/infra/blob/main/docker/nest/hedgedoc/privacy.md
[directly contact Andrei Jiroh]: https://andreijiroh.dev/contact
