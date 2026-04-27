# void-cast — Developer Note

## Core Model

* Single shared world (same data for all users)
* Users differ only by **camera position (URL-encoded coords)**
* No rooms, no partitions

## Messages

* Stored: `id`, `text`, `createdAt`
* No stored position
* Position is computed on client:

  * deterministic per message
  * time-based
  * pseudo-random motion
* All clients render identical movement

## Motion

* Random-looking, but deterministic (seeded by `id`)
* Continuous drift over time
* No need to sync positions via backend

## User Position

* On first load:

  * assign random coordinates
  * persist in URL
* URL = camera state (shareable view, not a room)

## Interaction Model

* No threads, no replies
* “Interaction” is spatial:

  * users write near what they see
* No expectation of revisiting content

## Ephemerality

* Messages are not meant to be found again
* Drift + space dynamics handle natural disappearance
* No need for strict deletion logic (optional DB cap only)

## Density Control

* Treat density as a system parameter:

  ```
  density = message_count / world_area
  ```

* As message count increases:

  * world size may expand OR
  * spawn distribution / drift adjusts

* Goal:

  * maintain usable visual density
  * avoid both overcrowding and emptiness

## World Behavior

* Not static:

  * evolves over time
  * no fixed “landmarks”
* Spatial memory is not a requirement

## Constraints

* Deterministic rendering across clients is critical
* Avoid true randomness (`Math.random`) in motion
* Time-based calculations must be consistent

## Non-Goals

* No persistent identity
* No chat system
* No navigation history / bookmarking
* No guarantee of message visibility over time
