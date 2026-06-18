import { relations } from "drizzle-orm";

import {
  corsairAccounts,
  corsairEntities,
  corsairEvents,
  corsairIntegrations,
} from "./schema";

export const integrationsRelations = relations(
  corsairIntegrations,
  ({ many }) => ({
    accounts: many(corsairAccounts),
  })
);

export const accountsRelations = relations(
  corsairAccounts,
  ({ one, many }) => ({
    integration: one(corsairIntegrations, {
      fields: [corsairAccounts.integrationId],
      references: [corsairIntegrations.id],
    }),

    entities: many(corsairEntities),
    events: many(corsairEvents),
  })
);

export const entitiesRelations = relations(
  corsairEntities,
  ({ one }) => ({
    account: one(corsairAccounts, {
      fields: [corsairEntities.accountId],
      references: [corsairAccounts.id],
    }),
  })
);

export const eventsRelations = relations(
  corsairEvents,
  ({ one }) => ({
    account: one(corsairAccounts, {
      fields: [corsairEvents.accountId],
      references: [corsairAccounts.id],
    }),
  })
);