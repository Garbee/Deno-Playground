CREATE OR REPLACE FUNCTION updated_timestamp()
    RETURNS TRIGGER AS
$$
BEGIN
    IF row (NEW.*) IS DISTINCT FROM row (OLD.*) THEN
        NEW.updated_at = now();
        RETURN NEW;
    ELSE
        RETURN OLD;
    END IF;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION guard_created_timestamp()
    RETURNS TRIGGER AS
$$
BEGIN
    IF row (NEW.created_at) IS DISTINCT FROM row (OLD.created_at) THEN
        RAISE WARNING 'created_at can not be modified';
        NEW.created_at = OLD.created_at;
        return NEW;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ language 'plpgsql';

CREATE TABLE public.users
(
    id         UUID PRIMARY KEY,
    email      varchar(254) UNIQUE                    NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_users_timestamp
    BEFORE UPDATE
    ON users
    FOR EACH ROW
EXECUTE PROCEDURE updated_timestamp();
CREATE TRIGGER guard_created_at_on_users
    BEFORE UPDATE
    ON users
    FOR EACH ROW
EXECUTE PROCEDURE guard_created_timestamp();

CREATE TABLE public.organizations
(
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_organizations_timestamp
    BEFORE UPDATE
    ON organizations
    FOR EACH ROW
EXECUTE PROCEDURE updated_timestamp();
CREATE TRIGGER guard_created_at_on_organizations
    BEFORE UPDATE
    ON organizations
    FOR EACH ROW
EXECUTE PROCEDURE guard_created_timestamp();

CREATE TABLE public.alerts
(
    id UUID PRIMARY KEY,
    description TEXT,
    user_id UUID NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    organization_id UUID NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(id)
            ON DELETE cascade
            ON UPDATE cascade,
    CONSTRAINT fk_organization
        FOREIGN KEY(organization_id)
            REFERENCES organizations(id)
            ON DELETE cascade
            ON UPDATE cascade
);

CREATE INDEX alerts_user_id_index ON alerts(user_id);

CREATE TRIGGER update_alerts_timestamp
    BEFORE UPDATE
    ON alerts
    FOR EACH ROW
EXECUTE PROCEDURE updated_timestamp();
CREATE TRIGGER guard_created_at_on_alerts
    BEFORE UPDATE
    ON alerts
    FOR EACH ROW
EXECUTE PROCEDURE guard_created_timestamp();

CREATE TABLE public.tags
(
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id UUID NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_owner
        FOREIGN KEY(owner_id)
            REFERENCES users(id)
            ON DELETE cascade
            ON UPDATE cascade
);

CREATE TRIGGER update_tags_timestamp
    BEFORE UPDATE
    ON tags
    FOR EACH ROW
EXECUTE PROCEDURE updated_timestamp();
CREATE TRIGGER guard_created_at_on_tags
    BEFORE UPDATE
    ON tags
    FOR EACH ROW
EXECUTE PROCEDURE guard_created_timestamp();

CREATE TABLE public.alert_tags
(
    alert_id UUID NOT NULL,
    tag_id UUID NOT NULL,
    PRIMARY KEY(alert_id, tag_id),
    CONSTRAINT fk_alert
        FOREIGN KEY(alert_id)
            REFERENCES alerts(id)
            ON DELETE cascade
            ON UPDATE cascade,
    CONSTRAINT fk_tag
        FOREIGN KEY(tag_id)
            REFERENCES tags(id)
            ON DELETE cascade
            ON UPDATE cascade
);
