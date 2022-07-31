--
-- OFFLINE PLAYERS IDS
-- 
create or replace view offline_ids as (
        select p.id
        FROM players as p
        where p."gameId" is null
    );
--
-- SUMMARIZE ROUND
-- 
create or replace function summarize_round(round_id int) returns table (
        "id" int,
        "userId" int,
        username varchar,
        email varchar,
        score bigint
    ) as $$ begin with player_grades as (
        select ppll.id,
            (
                select count(grr.id)
                from players as pll
                    left join grades as grr on grr."createdByPlayerId" = pll.id
                    left join memes as mmm on grr."memeId" = mmm.id
                    left join game_rounds as roo on roo.id = mmm."roundId"
                where mmm."createdByPlayerId" not in (table offline_ids)
                    and pll.id = ppll.id
                    and roo.id = round_id
                group by pll.id
            ) as count_of_grades
        from players as ppll
    ),
    timedout as (
        select player_grades.id
        from player_grades
        where count_of_grades is null
            or count_of_grades < (
                select count(p.id)
                from players as p
                where p."gameId" is not null
            ) - 1
    )
update grades
set score = 0
where grades.id in (
        select gr.id
        from grades as gr
            inner join memes as mm on gr."memeId" = mm.id
            inner join game_rounds as ro on ro.id = mm."roundId"
            inner join players as pl on gr."createdByPlayerId" = pl.id
        where (
                (
                    mm."createdByPlayerId" in (table offline_ids)
                    or mm."createdByPlayerId" in (table timedout)
                )
                or (
                    gr."createdByPlayerId" in (table offline_ids)
                    or gr."createdByPlayerId" in (table timedout)
                )
            )
            and ro.id = round_id
    );
return query
select pl.id,
    us.id as "userId",
    us.username,
    us.email,
    (
        case
            when sum(gr.score) is null then 0
            else sum(gr.score)
        end
    ) as score
from memes as mm
    left join game_rounds as ro on ro.id = mm."roundId"
    left join grades as gr on gr."memeId" = mm.id
    left join players as pl on pl.id = mm."createdByPlayerId"
    left join users as us on us.id = mm."createdById"
where ro.id = round_id
group by us.id,
    pl.id
order by score desc;
end;
$$ language plpgsql;
-- 
-- GET ROUND RESULTS
-- 
create or replace function get_round_results(round_id int) returns table (
        "id" int,
        "userId" int,
        username varchar,
        email varchar,
        score bigint
    ) as $$ begin return query
select pl.id,
    us.id as "userId",
    us.username,
    us.email,
    (
        case
            when sum(gr.score) is null then 0
            else sum(gr.score)
        end
    ) as score
from memes as mm
    left join game_rounds as ro on ro.id = mm."roundId"
    left join grades as gr on gr."memeId" = mm.id
    left join players as pl on pl.id = mm."createdByPlayerId"
    left join users as us on us.id = mm."createdById"
where ro.id = round_id
group by us.id,
    pl.id
order by score desc;
end;
$$ language plpgsql;
-- 
-- GET GAME RESULTS
-- 
create or replace function get_game_results(game_id int) returns table (
        "id" int,
        "userId" int,
        username varchar,
        email varchar,
        score bigint
    ) as $$ begin return query
select pl.id,
    us.id as "userId",
    us.username,
    us.email,
    (
        case
            when sum(gr.score) is null then 0
            else sum(gr.score)
        end
    ) as score
from memes as mm
left join grades as gr on gr."memeId" = mm.id
left join game_rounds as ro on ro.id = mm."roundId"
left join games as gg on gg.id = ro."gameId"
left join players as pl on pl.id = mm."createdByPlayerId"
left join users as us on us.id = pl."userId"
where gg.id = game_id
group by us.id,
    pl.id
order by score desc;
end;
$$ language plpgsql;
-- 
-- GET GRADES COUNT
-- 
create or replace function get_submitted_grades_count(round_id int) returns table ("count" bigint) as $$ begin return query
select count(gr.id)
from grades as gr
    inner join memes as mm on gr."memeId" = mm.id
    inner join game_rounds as ro ON ro.id = mm."roundId"
where mm."createdByPlayerId" not in (table offline_ids)
    and gr."createdByPlayerId" not in (table offline_ids)
    and ro.id = round_id;
end;
$$ language plpgsql;